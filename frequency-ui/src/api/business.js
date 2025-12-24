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