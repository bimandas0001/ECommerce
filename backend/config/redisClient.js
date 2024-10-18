import redis from 'redis';

let client = null;

async function connectToRedis() {    
    try {
        client = redis.createClient({url: process.env.REDIS_SERVER_URL});

        await client.connect()
        .then(() => {
            console.log("Connected to Redis")

            /* Redis error listener.
               This prevents unexpected server failure on sudden redis errors.
            */
            client.on('error', (err) => {
                console.log('Redis client error:');
                /* Remove the event listener just after listening an error 
                   as when error ocuurs then it revoke the callback function until the error is solved.
                   That leads to prevents some other tasks (e.g.: blocks connecting with database). 
                */
                client.removeAllListeners('error');
                client = null;
            });
        })
        .catch(err => {
            console.error('Error connecting to Redis: \n')
            client = null;
        });

        return client;
    }
    catch(err) {
        console.log('Error during Redis client creation: \n');
        client = null;
    }
}

await connectToRedis();

// Set interval to check if redis is down and try to reconnect.
setInterval(async () => {
    if(!client || !client.isOpen) {
        console.log('Redis client is not connected. Retrying to connect...');
        await connectToRedis();
    }
}, process.env.REDIS_RECONNECTION_INTERVAL * 1000);  // Interval in milliseconds

// Get client from this function, so that always get the updated client.
export function getRedisClient() {
    return client;
}
