import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // 测试环境
    environment: 'jsdom',
    
    // 全局测试设置
    globals: true,
    
    // 测试文件匹配模式
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    
    // 排除的目录
    exclude: ['node_modules', 'dist', '.idea'],
    
    // 代码覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.js'],
      exclude: [
        'node_modules/',
        'dist/',
        '.idea/',
        '**/*.config.js',
        '**/mockData',
        'coverage/',
      ],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
    
    // 测试输出
    reporters: ['default'],
    
    // 测试超时时间（毫秒）
    testTimeout: 10000,
  },
});
