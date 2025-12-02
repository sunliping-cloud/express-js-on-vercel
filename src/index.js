const express = require('express');
const app = express();

// 中间件配置
app.use(express.json());
app.use(express.text({ type: 'text/xml' }));
app.use(express.urlencoded({ extended: true }));

// 配置信息
const config = {
  wework: {
    corpId: 'ww308f23e4b78d3855',
    agentId: '1000004',
    secret: 'BzFqSyg0e2tBL05sABgoErjW1uOBZVyQidHUFgxICHk'
  }
};

// 根路由 - 服务状态
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: '🏢 汇界财税AI助手中转服务运行中',
    service: 'Coze-WeWork Bridge',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      callback: '/wework/callback',
      health: '/health',
      test: '/test'
    }
  });
});

// 企业微信回调验证 (GET)
app.get('/wework/callback', (req, res) => {
  const { echostr, msg_signature, timestamp, nonce } = req.query;
  
  console.log('🔍 企业微信回调验证:', { 
    echostr: echostr ? String(echostr).substring(0, 20) + '...' : 'none',
    msg_signature, 
    timestamp, 
    nonce 
  });
  
  if (echostr) {
    console.log('✅ 验证成功，返回echostr');
    res.send(String(echostr));
  } else {
    console.log('⚠️ 无echostr参数，返回OK');
    res.send('OK');
  }
});

// 企业微信消息处理 (POST)
app.post('/wework/callback', async (req, res) => {
  try {
    console.log('📨 收到企业微信消息');
    console.log('📋 请求体:', JSON.stringify(req.body, null, 2));
    
    // 财税服务响应内容
    const serviceResponse = {
      msgtype: 'text',
      text: {
        content: `🏢 汇界财税AI助手为您服务！

📊 核心业务：
• 代理记账：小规模纳税人 400-1000元/月
• 税务申报：一般纳税人 1500-5000元/月
• 工商注册：公司注册 800-2000元
• 财务咨询：专业顾问一对一服务
• 税务筹划：合规节税方案设计

💼 服务优势：
✅ 15年专业经验
✅ 一对一专属顾问
✅ 全程透明收费
✅ 7×24小时服务

📞 立即咨询：
• 服务热线：400-XXX-XXXX
• 专属顾问：13905793832
• 微信咨询：添加财税专家

🎯 让专业的人做专业的事，财税无忧！`
      }
    };
    
    console.log('📤 返回财税服务响应');
    res.json(serviceResponse);
    
  } catch (error) {
    console.error('❌ 处理消息失败:', error);
    res.status(500).json({
      msgtype: 'text',
      text: {
        content: `系统繁忙，请稍后再试 🔧

紧急联系方式：
📞 电话：13905793832
💬 微信：直接添加财税顾问

我们会尽快为您解决问题！`
      }
    });
  }
});

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: '汇界财税AI助手中转服务',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 测试接口
app.get('/test', (req, res) => {
  res.json({
    message: '🧪 测试接口正常',
    service: '汇界财税AI助手',
    callback_url: req.protocol + '://' + req.get('host') + '/wework/callback',
    timestamp: new Date().toISOString()
  });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('💥 服务器错误:', err);
  res.status(500).json({
    error: '服务器内部错误',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    error: '接口不存在',
    path: req.path,
    method: req.method,
    available_endpoints: [
      'GET /',
      'GET /health', 
      'GET /test',
      'GET /wework/callback',
      'POST /wework/callback'
    ],
    timestamp: new Date().toISOString()
  });
});

const port = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(port, () => {
    console.log(`🚀 汇界财税AI助手中转服务启动成功！`);
    console.log(`📡 服务端口: ${port}`);
    console.log(`🌐 企业微信回调: /wework/callback`);
  });
}

module.exports = app;
Update to WeWork webhook for 汇界财税AI助手
Rename to .js for proper deployment
