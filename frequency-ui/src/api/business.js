import request from './request';
import Cookies from 'js-cookie';

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
        const url = `${baseURL}/business/chat/stream?echoId=${encodeURIComponent(echoId)}&query=${encodeURIComponent(query)}`;

        console.log('Stream Chat URL:', url);

        const token = Cookies.get('access_token');
        console.log('Token:', token ? 'exists' : 'missing');

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'text/event-stream',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            signal
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok || !response.body) {
            throw new Error('无法建立对话连接');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            console.log('Raw chunk:', chunk);
            buffer += chunk;

            // 检查是否是 SSE 格式（包含 data: 前缀）
            if (buffer.includes('data:')) {
                let boundaryIndex = buffer.indexOf('\n\n');
                while (boundaryIndex !== -1) {
                    const chunkData = buffer.slice(0, boundaryIndex);
                    buffer = buffer.slice(boundaryIndex + 2);
                    console.log('Parsed chunk:', chunkData);

                    const lines = chunkData.split('\n');
                    const dataLines = lines
                        .map((line) => line.trim())
                        .filter((line) => line.startsWith('data:'))
                        .map((line) => line.replace(/^data:\s?/, ''));

                    console.log('Data lines:', dataLines);

                    if (dataLines.length) {
                        onMessage?.(dataLines.join('\n'));
                    }
                    boundaryIndex = buffer.indexOf('\n\n');
                }
            } else {
                // 纯文本流，直接返回
                if (buffer.length > 0) {
                    onMessage?.(buffer);
                    buffer = '';
                }
            }
        }

        onComplete?.();
    } catch (error) {
        console.error('Stream Chat Error:', error);
        if (signal?.aborted) {
            return;
        }
        onError?.(error);
    }
};
