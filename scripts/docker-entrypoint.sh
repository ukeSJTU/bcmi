#!/bin/sh
set -e

echo "Starting application..."

# 检查是否需要初始化数据库
if [ ! -f "/app/data/payload.db" ] || [ "$FORCE_SEED" = "true" ]; then
    echo "Initializing database..."
    
    # 根据环境选择不同的 seed 脚本
    if [ "$NODE_ENV" = "production" ]; then
        echo "Running production seed..."
        pnpm seed:prod
    else
        echo "Running development seed..."
        pnpm seed:dev
    fi
    
    echo "Database initialization completed."
fi

# 启动应用
echo "Starting Next.js application..."
# exec node server.js
exec pnpm start
