import request from './request';

// 1. 获取我的分身信息
export const getMyProfile = () => {
    return request.get('/business/echo-profile/my');
};

// 2. 发起同频测试 (Vibe Check)
export const startVibeCheck = (targetUserId) => {
    return request.post('/business/ai-experiment/vibe-check', {
        targetUserId: targetUserId,
        rounds: 4 // 默认聊4轮
    }, {
        timeout: 60000 // AI 响应较慢，超时设长一点
    });
};

// 3. (Mock) 获取推荐列表 - 暂时模拟，后续可对接真实接口
export const getRecommendedUsers = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { userId: 101, nickname: '清华卷王', school: 'THU', mbti: 'INTJ', heat: 95 },
                { userId: 102, nickname: '央美设计', school: 'CAFA', mbti: 'ISFP', heat: 88 },
                { userId: 103, nickname: '体院E人', school: 'BSU', mbti: 'ESFP', heat: 92 },
                { userId: 104, nickname: '极客代码', school: 'BUPT', mbti: 'INTP', heat: 85 },
                { userId: 105, nickname: '北影演员', school: 'BFA', mbti: 'ENFP', heat: 90 },
                { userId: 106, nickname: '中传主持', school: 'CUC', mbti: 'ESFJ', heat: 87 },
            ]);
        }, 800);
    });
};

export const streamChat = async ({ echoId, query, onMessage, onError, onComplete, signal }) => {
    try {
        const baseURL = request.defaults.baseURL || '';
        const origin = window.location.origin;
        const resolvedBase = baseURL.startsWith('http') ? baseURL : `${origin}${baseURL}`;
        const url = new URL('/business/chat/stream', resolvedBase);
        url.searchParams.set('echoId', echoId);
        url.searchParams.set('query', query);

        const token = localStorage.getItem('access_token');
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                Accept: 'text/event-stream',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            signal
        });

        if (!response.ok || !response.body) {
            throw new Error('无法建立对话连接');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            let boundaryIndex = buffer.indexOf('\n\n');
            while (boundaryIndex !== -1) {
                const chunk = buffer.slice(0, boundaryIndex);
                buffer = buffer.slice(boundaryIndex + 2);
                const lines = chunk.split('\n');
                const dataLines = lines
                    .map((line) => line.trim())
                    .filter((line) => line.startsWith('data:'))
                    .map((line) => line.replace(/^data:\s?/, ''));

                if (dataLines.length) {
                    onMessage?.(dataLines.join('\n'));
                }
                boundaryIndex = buffer.indexOf('\n\n');
            }
        }

        onComplete?.();
    } catch (error) {
        if (signal?.aborted) {
            return;
        }
        onError?.(error);
    }
};
