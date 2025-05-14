const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data.json');

let memos = []; // 内存中的假数据
const usedIds = new Set();


function saveMemosToFile() {
    fs.writeFileSync(DATA_PATH, JSON.stringify(memos, null, 2), 'utf-8');
}

function loadMemosFromFile() {
    if (fs.existsSync(DATA_PATH)) {
        const data = fs.readFileSync(DATA_PATH, 'utf-8');
        try {
            memos = JSON.parse(data);
            memos.forEach(m => usedIds.add(m.id));
        } catch (e) {
            console.error('❌ JSON 解析失败:', e);
        }
    }
}


loadMemosFromFile();


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
    saveMemosToFile();
    res.status(201).json(newMemo);
});


// 获取单个备忘录
router.get('/:id', (req, res) => {
    const id = String(req.params.id); // 👈 强制转字符串
    let memo = memos.find(m => m.id === id);

    if (id === 'DELETEALL') {
        memos = [];
        usedIds.clear();
        // delete the json file
        fs.unlink(DATA_PATH, (err) => {
            if (err) {
                console.error('❌ 删除文件失败:', err);
            } else {
                console.log('✅ 删除文件成功');
            }
        });
        saveMemosToFile();
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
    saveMemosToFile();
});


// 删除备忘录
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    memos = memos.filter(m => {
        if (m.id === id) usedIds.delete(id);
        return m.id !== id;
    });
    saveMemosToFile();
    res.status(204).end();
});

// // 清空所有备忘录
// router.delete('/', (req, res) => {
//     memos = [];
//     res.status(204).end();
//     saveMemosToFile();
// });

module.exports = router;
