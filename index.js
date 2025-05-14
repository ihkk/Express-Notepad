const express = require('express');
const app = express();
const memoRouter = require('./routes/memo');

app.use(express.json()); // 解析 JSON 请求体
app.use('/api/memos', memoRouter); // 路由挂载

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
