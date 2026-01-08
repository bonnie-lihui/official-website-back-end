import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

(async () => {
  try {
    // 启动 PM2
    console.log('正在启动 PM2...');
    execSync('pm2 start ecosystem.config.cjs', { 
      cwd: projectRoot, 
      stdio: 'inherit' 
    });
    
    // 等待服务器启动
    console.log('等待服务器启动...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 显示日志
    console.log('\n=== 服务器启动日志 ===');
    try {
      const logs = execSync('pm2 logs request-proxy-server --lines 20 --nostream', { 
        cwd: projectRoot,
        encoding: 'utf-8'
      });
      console.log(logs);
    } catch (error) {
      // 如果日志命令失败，尝试读取日志文件
      try {
        const logFile = join(projectRoot, 'logs', 'pm2-out.log');
        const logContent = readFileSync(logFile, 'utf-8');
        const lines = logContent.split('\n').slice(-10).join('\n');
        console.log(lines);
      } catch (e) {
        console.log('无法读取日志，请使用 "npm run pm2:logs" 查看');
      }
    }
    
    console.log('\n✅ 服务器已启动！');
    console.log('使用 "npm run pm2:logs" 查看实时日志');
    console.log('使用 "pm2 status" 查看运行状态');
  } catch (error) {
    console.error('启动失败:', error.message);
    process.exit(1);
  }
})();

