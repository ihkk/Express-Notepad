const express = require('express');
const router = express.Router();

let memos = []; // 内存中的假数据
let idCounter = 1;

// 获取所有备忘录
router.get('/', (req, res) => {
    res.json(memos);
});

// 创建新备忘录
router.post('/', (req, res) => {
    const { content } = req.body;
    const newMemo = { id: idCounter++, content };
    memos.push(newMemo);
    res.status(201).json(newMemo);
});

// 更新备忘录
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const memo = memos.find(m => m.id === parseInt(id));

    if (!memo) return res.status(404).json({ error: 'Not found' });

    memo.content = content;
    res.json(memo);
});

// 删除备忘录
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    memos = memos.filter(m => m.id !== parseInt(id));
    res.status(204).end();
});

module.exports = router;
