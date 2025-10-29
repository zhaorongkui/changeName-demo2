const loadRuntimeEnv = () => {
    return window.__bewg_front_env
      ? window.__bewg_front_env
      : {}
  };
    
  const loadCompileEnv = () => {
    let compileTimeEnv;
    try {
      compileTimeEnv = import.meta.env;
    } catch (error) {
      console.log("error while reading compile environments")
      compileTimeEnv = {};
    }
    return compileTimeEnv;
  };
    
  const runtimeEnv = loadRuntimeEnv()
  const compileEnv = loadCompileEnv()
    
  /**
   * 获取环境变量的值，先从运行时环境变量获取，如果获取不到，则从编译时的环境变量获取。
   * @param key 环境变量的key
   * @returns {null|*}
   */
  export function getEnv(key) {
    if (runtimeEnv.hasOwnProperty(key)) {
      return runtimeEnv[key];
    } else if (compileEnv.hasOwnProperty(key)) {
      return compileEnv[key];
    } else {
      return null;
    }
    
  }
    
  /**
   * 从.env.xxx文件中获取项目关注的环境变量
   * 使用这种方式，可以保证编译时与运行时环境变量的key保持一致，但是对于IDE的智能提示可能不太友好
   */
  function getProjectEnvAccordingCompileEnv() {
    const env = {}
    Object.keys(compileEnv)
      .filter(key => key.startsWith("VITE") && key !== 'VITE_API_ENV')
      .forEach(
        key => env[key] = getEnv(key)
      )
    return env;
  }
    
  // 生成实际生效的环境变量对象。该对象会被用来查询环境变量的值
  const projectEnv = getProjectEnvAccordingCompileEnv();
    
  export default projectEnv;