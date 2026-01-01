#!/bin/bash

# Start all required services for Athaan Fi Beit system
echo "🚀 Starting Athaan Fi Beit Services..."

# Kill any existing MongoDB processes
pkill mongod 2>/dev/null || true
sleep 2

# Create MongoDB data directory
mkdir -p /tmp/mongodb

# Start MongoDB with proper configuration
echo "📦 Starting MongoDB..."
mongod --dbpath /tmp/mongodb \
       --port 27017 \
       --fork \
       --logpath /tmp/mongodb/mongod.log \
       --pidfilepath /tmp/mongodb/mongod.pid \
       --bind_ip 127.0.0.1 \
       --quiet

if [ $? -eq 0 ]; then
    echo "✅ MongoDB started successfully on port 27017"
else
    echo "❌ Failed to start MongoDB"
    exit 1
fi

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
sleep 3

# Test MongoDB connection
if mongo --eval "db.runCommand('ping').ok" localhost:27017/test --quiet; then
    echo "✅ MongoDB connection verified"
else
    echo "❌ MongoDB connection failed"
    exit 1
fi

# Start monitoring MongoDB in background
nohup bash -c '
while true; do
    if ! pgrep mongod > /dev/null; then
        echo "🔄 MongoDB crashed, restarting..."
        mongod --dbpath /tmp/mongodb --port 27017 --fork --logpath /tmp/mongodb/mongod.log --pidfilepath /tmp/mongodb/mongod.pid --bind_ip 127.0.0.1 --quiet
    fi
    sleep 30
done
' > /tmp/mongodb-monitor.log 2>&1 &

echo "🎯 All services started successfully!"
echo "📊 Services Status:"
echo "   - MongoDB: Running on port 27017"
echo "   - MongoDB Monitor: Running in background"
echo ""
echo "🔍 Monitor logs:"
echo "   MongoDB: tail -f /tmp/mongodb/mongod.log"
echo "   Monitor: tail -f /tmp/mongodb-monitor.log"