const express = require('express');
const router = express.Router();

let memos = []; // 内存中的假数据
const usedIds = new Set();


function generateReadableId() {
    const repeatCount = Math.floor(Math.random() * 2) + 2; // 2 或 3
    const repeatDigit = Math.floor(Math.random() * 10).toString(); // 要重复的数字

    let digits = [];

    // 先放入重复的数字
    for (let i = 0; i < repeatCount; i++) {
        digits.push(repeatDigit);
    }

    // 再加入其他随机不重复的数字，直到长度为6
    while (digits.length < 6) {
        const rand = Math.floor(Math.random() * 10).toString();
        if (rand !== repeatDigit || digits.filter(d => d === rand).length < repeatCount) {
            digits.push(rand);
        }
    }

    // 打乱顺序
    for (let i = digits.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [digits[i], digits[j]] = [digits[j], digits[i]];
    }

    return digits.join('');
}


// 获取所有备忘录
router.get('/', (req, res) => {
    res.json(memos);
});

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

// 清空所有备忘录
router.delete('/', (req, res) => {
    memos = [];
    res.status(204).end();
});

module.exports = router;
