const express = require('express');
const router = express.Router();

let memos = []; // 内存中的假数据
const usedIds = new Set();


function generateReadableId() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        id += chars[randomIndex];
    }
    return id;
}



// 获取所有备忘录
// router.get('/', (req, res) => {
//     res.json(memos);
// });

// 创建新备忘录
router.post('/', (req, res) => {
    const { id, content } = req.body;
    const newId = id || generateReadableId();

    if (memos.find(m => m.id === newId)) {
        return res.status(409).json({ error: 'ID already exists' });
    }

    const newMemo = { id: newId, content };
    memos.push(newMemo);
    usedIds.add(newId);
    res.status(201).json(newMemo);
});


// 获取单个备忘录
router.get('/:id', (req, res) => {
    const id = String(req.params.id); // 👈 强制转字符串
    let memo = memos.find(m => m.id === id);

    if (id === 'DELETEALL') {
        memos = [];
        usedIds.clear();
        return res.status(204).end();
    }

    if (!memo) {
        memo = { id: id, content: '' };
        memos.push(memo);
        usedIds.add(id); // 👈 确保加入 Set 中
        console.log(`自动创建新备忘录: ${id}`);
    }


    res.json(memo);
});


// 更新备忘录
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const memo = memos.find(m => m.id === id);
    if (!memo) return res.status(404).json({ error: 'Not found' });
    memo.content = content;
    res.json(memo);
});


// 删除备忘录
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    memos = memos.filter(m => {
        if (m.id === id) usedIds.delete(id);
        return m.id !== id;
    });
    res.status(204).end();
});

// // 清空所有备忘录
// router.delete('/', (req, res) => {
//     memos = [];
//     res.status(204).end();
// });

module.exports = router;
