import request from './request';
import Cookies from 'js-cookie';

// 1. 获取我的分身信息
export const getMyProfile = () => {
    return request.get('/ai/profile/my');
};

// 1.1 更新我的分身信息
export const updateMyProfile = (payload) => {
    return request.put('/ai/profile/my', payload);
};

// 1.2 上传并训练知识文件
export const trainKnowledgeFile = (file, userId) => {
    const formData = new FormData();
    formData.append('file', file);
    if (userId !== undefined && userId !== null && userId !== '') {
        formData.append('userId', String(userId));
    }
    return request.post('/ai/bizKnowledgeBase/train', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        timeout: 120000
    });
};

// 2. 发起同频测试 (Vibe Check)
export const startVibeCheck = (targetUserId) => {
    return request.post('/ai/match/vibe-check', {
        targetUserId: targetUserId,
        rounds: 4 // 默认聊4轮
    }, {
        timeout: 60000 // AI 响应较慢，超时设长一点
    });
};

// 3. (Mock) 获取推荐列表 - 暂时模拟，后续可对接真实接口
export const getRecommendedUsers = () => {
    return request.get('/ai/social/recommend');
};

export const getSocialFeed = (limit = 20) => {
    return request.get('/ai/social/feed', { params: { limit } });
};

export const publishSocialMoment = (payload) => {
    return request.post('/ai/social/moment/publish', payload);
};

export const toggleMomentLike = (momentId, like = true) => {
    return request.post(`/ai/social/moment/${momentId}/like`, null, { params: { like } });
};

export const listMomentComments = (momentId, limit = 20) => {
    return request.get(`/ai/social/moment/${momentId}/comments`, { params: { limit } });
};

export const createMomentComment = (momentId, content) => {
    return request.post('/ai/social/moment/comment', { momentId, content });
};

export const getMyOverview = () => {
    return request.get('/ai/social/me/overview');
};

export const getAiRuntimeOverview = () => {
    return request.get('/ai/platform/runtime');
};

export const listHotFeatures = (limit = 6) => {
    return request.get('/ai/hot-feature/list', { params: { limit } });
};

export const reportHotFeature = (payload) => {
    return request.post('/ai/hot-feature/report', payload);
};

export const uploadMusicTrack = (file, durationSeconds = 0) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('durationSeconds', String(durationSeconds || 0));
    return request.post('/ai/music/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        timeout: 120000
    });
};

export const listMusicTracks = (limit = 200) => {
    return request.get('/ai/music/list', { params: { limit } });
};

export const fetchMusicTrackBlob = (trackId) => {
    return request.get('/ai/music/file', {
        params: { trackId },
        responseType: 'blob',
        timeout: 120000
    });
};

export const streamChat = async ({ query, conversationId, echoId, onMessage, onError, onComplete, signal }) => {
    try {
        const baseURL = request.defaults.baseURL || '';
        const url =
            `${baseURL}/ai/chat/stream?query=${encodeURIComponent(query)}` +
            `${conversationId ? `&conversationId=${encodeURIComponent(conversationId)}` : ''}` +
            `${echoId !== undefined && echoId !== null && echoId !== '' ? `&echoId=${encodeURIComponent(String(echoId))}` : ''}`;

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

// 获取历史聊天记录
// 参数：page - 当前页码，size - 每页条数，conversationId - 会话ID（可选）
export const getChatHistory = async (page = 1, size = 20, conversationId = null) => {
    try {
        const params = {
            current: page,
            size: size
        };
        
        if (conversationId) {
            params.conversationId = conversationId;
        }
        
        const response = await request.get('/ai/chat/history/page', {
            params
        });
        
        return response.data?.data ?? response.data;
    } catch (error) {
        console.error('获取聊天历史记录失败:', error);
        throw error;
    }
};
