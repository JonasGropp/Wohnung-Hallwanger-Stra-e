import {defineConfig} from '@playwright/test';
import {existsSync} from 'node:fs';
export default defineConfig({testDir:'./tests/browser',timeout:60000,expect:{timeout:12000},workers:1,use:{baseURL:'http://localhost:5173',viewport:{width:1600,height:1000},launchOptions:{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']},acceptDownloads:true},webServer:{command:'npm run dev',url:'http://localhost:5173',reuseExistingServer:true,timeout:30000}});
