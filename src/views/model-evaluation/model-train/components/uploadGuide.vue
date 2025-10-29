<template>
<!--  模型上传指南-->
  <div class="active content" id="help" role="tabpanel" >
    <div class="title"><el-icon><InfoFilled /></el-icon>MLflow模型训练指南</div>
    <div class="warning-title">当您的项目中没有现有模型代码时，请按照以下步骤使用MLflow框架进行模型训练和上传。</div>

    <div>
      <div>
        <span class="serial-number">1</span>
        环境设置</div>
      <div class="description-text">首先确保您的Python环境中已安装MLflow：</div>
      <div class="code-box">
        <span style="display: inline-flex;color: #d63384">pip install mlflow</span>
      </div>
    </div>

    <div>
      <div>
        <span class="serial-number">2</span>
        基本训练模板</div>
      <div class="description-text">使用以下代码模板开始训练并记录模型：</div>
      <div class="code-box">
       <pre><code>import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier

# 启动MLflow运行
with mlflow.start_run():
    # 记录参数
    mlflow.log_param("n_estimators", 100)
    mlflow.log_param("max_depth", 5)

    # 训练模型
    model = RandomForestClassifier(n_estimators=100, max_depth=5)
    model.fit(X_train, y_train)

    # 评估模型
    accuracy = model.score(X_test, y_test)
    mlflow.log_metric("accuracy", accuracy)

    # 记录模型
    mlflow.log_model(model, "random_forest_model")</code></pre>
      </div>
    </div>


    <div>
      <div>
        <span class="serial-number">3</span>
        上传模型到MLflow</div>
      <div class="description-text">使用
        <span style="display: inline-block;color: #d63384">mlflow.log_model()</span>
        函数将训练好的模型上传到MLflow服务器：</div>
      <div class="code-box">
         <pre><code># 记录模型到MLflow
mlflow.log_model(model, "model", registered_model_name="MyModel")

# 或者保存到本地
mlflow.sklearn.save_model(model, "my_model")</code></pre>
      </div>
    </div>



    <div>
      <div>
        <span class="serial-number">4</span>
        验证上传结果</div>
      <div class="description-text">在MLflow UI中检查模型是否成功上传：</div>
      <div class="code-box">
        <span style="display: inline-flex;color: #d63384">mlflow ui</span>
      </div>
      <div  class="description-text">然后在浏览器中访问
        <span style="display: inline-block;margin: 0 10px;color:#D63384">http://localhost:5000 </span>
        查看模型信息。</div>
    </div>

    <div class="bottom-box">
      <div><el-icon style="margin-right: 10px;vertical-align: sub"><WarningFilled /></el-icon>提示</div>
      <div>确保MLflow服务器配置正确，并且您有适当的权限上传模型。如需帮助，请联系系统管理员。</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { InfoFilled ,WarningFilled} from '@element-plus/icons-vue'
</script>
<style lang="scss" scoped>
 .content{
   width: 60%;
   font-size: 16px;
   padding: 20px;
   margin-top: 20px;
   box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
   overflow-y: scroll;
   .title{
     height: 40px;
     display: flex;
     align-items: center;
     font-size: 16px;
     font-weight: bold;
     border-bottom: 1px solid #eee;
   }
   .warning-title{
     margin: 20px 0;
   }
   .description-text{
     line-height: 30px;
   }
   .serial-number{
     display: inline-flex;
     width: 30px;
     height: 30px;
     border-radius: 50%;
     background: #4361ee;
     color: #fff;
     justify-content: center;
     align-items: center;
   }
   .code-box{
     background: #0a0a0a;
     min-height: 56px;
     display: flex;
     align-items: center;
     border-radius: 6px;
     margin: 20px 0;
     padding: 20px 0 20px 20px ;
   }
   .two-box{

   }
   code{
     color: #fff;
   }
   .bottom-box{
     background: #cff4fc;
     height: 100px;
     margin: 20px 0;
     padding: 16px;
     color: #055160;
     border-radius: 8px;
   }
 }

</style>