// const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, SchemaType } = require('@google/generative-ai');

import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

const schema = {
    description: 'Schema cho bảng quản lý công việc với các cột và thẻ',
    type: SchemaType.OBJECT,
    properties: {
        title: {
            type: SchemaType.STRING,
            description: 'Tiêu đề bảng',
            nullable: false,
        },
        description: {
            type: SchemaType.STRING,
            description: 'Mô tả bảng',
            nullable: true,
        },
        type: {
            type: SchemaType.STRING,
            description: 'Kiểu bảng (private/public)',
            nullable: false,
        },
        image: {
            type: SchemaType.STRING,
            description: 'Ảnh đại diện bảng',
            nullable: true,
        },
        columnOrderIds: {
            type: SchemaType.ARRAY,
            description: 'Danh sách UUID của các cột theo thứ tự',
            items: {
                type: SchemaType.STRING,
            },
            nullable: false,
        },
        columns: {
            type: SchemaType.ARRAY,
            description: 'Danh sách các cột trong bảng',
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    title: { type: SchemaType.STRING, nullable: false },
                    uuid: { type: SchemaType.STRING, nullable: false },
                    cardOrderIds: {
                        type: SchemaType.ARRAY,
                        description: 'Danh sách UUID của các thẻ theo thứ tự',
                        items: { type: SchemaType.STRING },
                        nullable: false,
                    },
                    cards: {
                        type: SchemaType.ARRAY,
                        items: {
                            type: SchemaType.OBJECT,
                            properties: {
                                title: { type: SchemaType.STRING, nullable: false },
                                description: { type: SchemaType.STRING, nullable: true },
                                uuid: { type: SchemaType.STRING, nullable: false },
                                dueDate: { type: SchemaType.STRING, nullable: false },
                                dueReminder: { type: SchemaType.NUMBER, nullable: false },
                                checklists: {
                                    type: SchemaType.ARRAY,
                                    items: {
                                        type: SchemaType.OBJECT,
                                        properties: {
                                            title: { type: SchemaType.STRING, nullable: false },
                                            checkItems: {
                                                type: SchemaType.ARRAY,
                                                items: {
                                                    type: SchemaType.OBJECT,
                                                    properties: {
                                                        title: { type: SchemaType.STRING, nullable: false },
                                                        status: {
                                                            type: SchemaType.STRING,
                                                            description: 'Trạng thái (incomplete/complete)',
                                                            nullable: false,
                                                        },
                                                    },
                                                    required: ['title', 'status'],
                                                },
                                            },
                                        },

                                        required: ['title', 'checkItems'],
                                    },
                                },
                            },

                            required: ['title', 'description', 'uuid', 'dueDate', 'dueReminder', 'checklists'],
                        },
                    },
                },
                required: ['title', 'uuid', 'cardOrderIds', 'cards'],
            },
        },
    },
    required: ['title', 'description', 'type', 'columnOrderIds', 'columns'],
};

const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        maxOutputTokens: 2000,
        temperature: 1.0,
    },
});

const googleAIGenerate = async (content) => {
    console.log('Generating...');

    const detailedPrompt = `
            Dựa trên gợi ý sau, hãy tạo một bảng quản lý chi tiết với cấu trúc như đã chỉ định trong schema:
            Gợi ý: ${content}
            
            Các yêu cầu:
            - Tiêu đề bảng là bắt buộc.
            - Mỗi cột phải có một UUID và danh sách các thẻ bên trong.
            - Thẻ phải có tiêu đề, checklists, mô tả (nếu có), và UUID.
            - Đảm bảo nội dung phù hợp với các quy tắc của schema và có tính thực tiễn.
            
            Ví dụ minh họa:
            - Bảng có tiêu đề "Quản lý dự án".
            - Có 2 cột: "Việc cần làm" và "Đang thực hiện".
            - Mỗi cột chứa danh sách các thẻ, mỗi thẻ có tiêu đề, mô tả chi tiết công việc.
        `;

    const result = await model.generateContent(detailedPrompt);

    return JSON.parse(result.response.text());
};

export default googleAIGenerate;
