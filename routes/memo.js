const express = require('express');
const router = express.Router();

let memos = []; // 内存中的假数据
let idCounter = 1;

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
    const { content } = req.body;
    const newMemo = { id: generateReadableId(), content };
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
