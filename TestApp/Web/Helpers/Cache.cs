using System;
using System.Runtime.Caching;

namespace TestApp.Helpers
{
    public class Cache
    {
        private static volatile Cache instance;
        private static readonly object syncRoot = new object();
        private static readonly int cacheMinutes = 10;

        public static Cache Instance
        {
            get
            {
                if (instance == null)
                {
                    lock (syncRoot)
                    {
                        if (instance == null)
                        {
                            instance = new Cache();
                        }
                    }
                }
                return instance;
            }
        }

        public void Add(string key, object value)
        {
            MemoryCache.Default.Set(key, value,
                new CacheItemPolicy {AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(cacheMinutes)});
        }

        public T Get<T>(string key)
        {
            var value = MemoryCache.Default.Get(key);
            return value == null ? default(T) : (T) value;
        }

        public bool Exist(string key)
        {
            return MemoryCache.Default.Contains(key);
        }
    }
}