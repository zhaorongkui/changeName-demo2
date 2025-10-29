# AI Model Sandbox Platform

A comprehensive AI model sandbox platform built with Vue 3, TypeScript, and Vite. This platform provides an integrated environment for model development, dataset management, tag management, model evaluation, and community collaboration.

## 🚀 Project Overview

The AI Model Sandbox Platform is a sophisticated web application designed to facilitate the entire lifecycle of AI model development and management. It offers features for dataset management, model training and evaluation, tag-based organization, and community collaboration through forums and competitions.

## ✨ Key Features

### 📊 Dataset Management
- **Dataset CRUD Operations**: Create, read, update, and manage datasets
- **Asset Binding**: Associate datasets with related assets
- **Data Plaza**: Browse and discover available datasets
- **My Datasets**: Personal dataset management
- **Data Search**: Advanced search functionality for datasets
- **Resource Applications**: Apply for access to restricted datasets

**数据集管理**
- **数据集 CRUD 操作**：创建、读取、更新和管理数据集
- **资源绑定**：将数据集与相关资源关联
- **数据广场**：浏览和发现可用的数据集
- **我的数据集**：个人数据集管理
- **数据搜索**：高级数据集搜索功能
- **资源申请**：申请访问受限数据集的权限

### 🤖 Model Development
- **Model Training**: Comprehensive model training capabilities
- **Model Evaluation**: Advanced evaluation tools and metrics
- **Model Deployment**: Deploy trained models to production
- **Base Models**: Access to pre-trained base models
- **Data Rule Models**: Specialized models for data validation
- **Model Plaza**: Browse and discover available models

**模型开发**
- **模型训练**：全面的模型训练功能
- **模型评估**：高级评估工具和指标
- **模型部署**：将训练好的模型部署到生产环境
- **基础模型**：访问预训练的基础模型
- **数据规则模型**：用于数据验证的专业模型
- **模型广场**：浏览和发现可用的模型

### 🏷️ Tag Management System
- **Hierarchical Tag Structure**: Organize resources using nested tag types and tags
- **Tag CRUD Operations**: Full create, read, update, delete functionality
- **Tag Type Management**: Define and manage tag categories
- **Dynamic Tag Assignment**: Flexible tagging system for models and datasets

**标签管理系统**
- **分层标签结构**：使用嵌套的标签类型和标签组织资源
- **标签 CRUD 操作**：完整的创建、读取、更新、删除功能
- **标签类型管理**：定义和管理标签类别
- **动态标签分配**：为模型和数据集提供灵活的标签系统

### 📈 Data Visualization
- **ECharts Integration**: Rich charting and data visualization
- **X6 Graph Visualization**: Interactive graph and network visualization
- **Formula Editor**: Mathematical formula creation and editing
- **Advanced Search**: Multi-criteria search and filtering

**数据可视化**
- **ECharts 集成**：丰富的图表和数据可视化功能
- **X6 图形可视化**：交互式图形和网络可视化
- **公式编辑器**：数学公式创建和编辑
- **高级搜索**：多条件搜索和过滤

### 🏆 Competition & Community
- **Model Competition Park**: Participate in AI model competitions
- **Forum System**: Community discussions and knowledge sharing
- **Contest Management**: Create and manage AI competitions
- **Performance Analysis**: Detailed competition analytics

**竞赛与社区**
- **模型竞赛公园**：参与 AI 模型竞赛
- **论坛系统**：社区讨论和知识分享
- **竞赛管理**：创建和管理 AI 竞赛
- **性能分析**：详细的竞赛分析

### 🔧 Technical Features
- **Multi-Environment Support**: Development, production, and UAT environments
- **Internationalization**: Multi-language support (Chinese/English)
- **Token Authentication**: Secure JWT-based authentication
- **Request Interception**: Centralized HTTP request handling
- **State Management**: Pinia-based reactive state management
- **Mock Data Generation**: Comprehensive mock data for development

**技术特性**
- **多环境支持**：开发、生产和用户验收测试环境
- **国际化**：多语言支持（中文/英文）
- **令牌认证**：安全的基于 JWT 的身份验证
- **请求拦截**：集中式 HTTP 请求处理
- **状态管理**：基于 Pinia 的响应式状态管理
- **模拟数据生成**：用于开发的全面模拟数据

## 🛠️ Technical Stack

### Core Technologies
- **Vue 3.4.37**: Progressive JavaScript framework with Composition API
- **TypeScript 5.5.3**: Type-safe JavaScript with strict type checking
- **Vite 5.4.1**: Fast build tool and development server with HMR
- **Element Plus 2.9.8**: Vue 3 component library with rich UI components

### State Management & Routing
- **Pinia 3.0.3**: Vue.js state management library with TypeScript support
- **Vue Router 4.4.5**: Official router for Vue.js with hash history
- **Vue-i18n 10.0.4**: Internationalization plugin with composition API support

### Data & Visualization
- **Axios 1.7.7**: HTTP client for API communication with interceptors
- **ECharts 5.5.1**: Powerful charting and visualization library
- **X6 1.36.10**: Graph visualization and editing framework
- **Vditor 4.10.4**: Rich text editor with markdown support

### Development Tools
- **PostCSS 8.4.47**: CSS transformation tool
- **Tailwind CSS 3.4.5**: Utility-first CSS framework
- **ESLint 9.15.0**: JavaScript linting utility with TypeScript support
- **Prettier 3.3.3**: Code formatter with consistent style

### Build & Dependencies
- **npm 10.8.3**: Package manager
- **Node.js 18.0+**: Runtime environment
- **@vitejs/plugin-vue 5.2.1**: Vue plugin for Vite
- **@types/node**: Node.js type definitions

## 📦 Installation

### Prerequisites
- Node.js 18.0 or higher
- npm 9.0 or higher
- Git for version control

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd model-sandbox-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   - Copy environment files:
     ```bash
     cp .env.development .env.local
     cp .env.production .env.local
     cp .env.uat .env.local
     ```
   - Configure your environment variables in `.env.local`
   - Required environment variables:
     ```
     VITE_APP_API_BASE_URL=your_api_base_url
     VITE_APP_TITLE=AI Model Sandbox Platform
     ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   - Development server runs on http://localhost:5173
   - Hot Module Replacement (HMR) enabled for instant updates

5. **Build for production**
   ```bash
   npm run build
   ```
   - Output directory: `dist/`
   - Optimized for production with tree shaking and code splitting

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure


## 🚀 Usage Guide

### Authentication
- The platform uses JWT token-based authentication
- Tokens are stored in localStorage
- Authentication headers are automatically added to API requests
- Token refresh mechanism for session management

### API Integration
- All API calls go through the centralized axios configuration
- Request/response interceptors handle authentication and error handling
- Base URLs and headers are configured per environment
- Request timeout and retry logic implemented
- Comprehensive error handling with user-friendly messages

### State Management
- Pinia stores are used for global state management
- Local storage persistence is enabled for critical data
- Modules are organized by feature area
- TypeScript types ensure type safety in state management

### Internationalization
- Support for Chinese (zh-CN) and English (en)
- Language files are stored in `src/i18n/language/`
- Use the `useI18n()` composable in components
- Dynamic language switching without page reload

### Component Architecture
- Vue 3 Composition API with `<script setup>` syntax
- TypeScript for type safety in component props and emits
- Reusable components with proper prop validation
- Event emission patterns for component communication

## 🔧 Configuration

### Environment Variables
- `.env.development`: Development environment settings
- `.env.production`: Production environment settings  
- `.env.uat`: User Acceptance Testing environment settings

### Key Configuration Files
- `vite.config.ts`: Vite build configuration with plugins and optimizations
- `tsconfig.json`: TypeScript configuration with strict type checking
- `tailwind.config.js`: Tailwind CSS configuration with custom themes
- `postcss.config.js`: PostCSS configuration for CSS processing
- `src/config/runtimeEnv.js`: Runtime environment configuration

### Build Configuration
- **Development**: Fast HMR with source maps
- **Production**: Optimized builds with code splitting and minification
- **UAT**: Pre-production environment with testing configurations

## 📊 API Structure

### Common API Patterns
- **Pagination**: Most list APIs support pagination with `page` and `pageSize` parameters
- **CRUD Operations**: Standard RESTful patterns for all entities
- **File Operations**: Dedicated file upload and management endpoints
- **Search**: Advanced search with multiple filter criteria
- **Batch Operations**: Support for bulk operations on entities

### Authentication Flow
```javascript
// Automatic token attachment
if (localStorage.getItem('token')) {
  config.headers.Authorization = localStorage.getItem('token')
} else if (hasTokenUrl.value.includes(url)) {
  config.headers['X-Tenant-Id'] = 'bewg'
}
```

### API Response Format
```typescript
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}
```

## 🧪 Development Features

### Mock Data Generation
- Comprehensive mock data using Mock.js
- Realistic data structures for development and testing
- Configurable mock responses for different scenarios
- Dynamic data generation based on API schemas

### Code Quality
- TypeScript for type safety
- ESLint for code linting with custom rules
- Prettier for code formatting with consistent style
- Vue 3 Composition API with `<script setup>` syntax
- Component prop validation and type checking

### Development Tools
- **Vite Dev Server**: Fast development with HMR
- **TypeScript Language Server**: Intelligent code completion
- **ESLint Plugin**: Real-time linting feedback
- **Vue DevTools**: Browser extension for debugging

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch from `develop`
3. Make your changes following coding standards
4. Add tests if applicable
5. Run linting and type checking
6. Submit a pull request to `develop` branch

### Code Standards
- **Naming Conventions**: kebab-case for files, PascalCase for components
- **Component Structure**: Consistent use of `<script setup>` syntax
- **TypeScript**: Strict type checking enabled
- **Code Style**: Prettier formatting with consistent indentation
- **Commit Messages**: Conventional Commits specification

### Pull Request Process
- All PRs must pass automated checks
- Code review required before merge
- Documentation updates required for new features
- Test coverage maintained or improved

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Getting Help
- Check the documentation in the `docs/` directory
- Submit issues in the GitHub repository
- Join the community forum
- Contact the development team

### Common Issues
- **Build Errors**: Check Node.js version and dependencies
- **TypeScript Errors**: Review type definitions and imports
- **API Issues**: Verify environment configuration and network access
- **Authentication**: Check token storage and expiration

## 📈 Performance Optimization

### Build Optimization
- **Vite Fast Refresh**: Instant HMR (Hot Module Replacement) during development
- **Tree Shaking**: Automatic dead code elimination in production builds
- **Code Splitting**: Automatic chunk generation for optimal loading
- **Lazy Loading**: Route-based code splitting for better performance

### Runtime Performance
- **Virtual Scrolling**: Efficient handling of large data lists
- **Debouncing**: Optimized search and filter operations
- **Caching**: Strategic data caching to reduce API calls
- **Memory Management**: Proper cleanup of event listeners and subscriptions

### Bundle Analysis
- Use `npm run build -- --mode analyze` to analyze bundle size
- Monitor third-party library usage
- Optimize large dependencies with dynamic imports

## 🔍 Testing

### Testing Strategy
- **Unit Testing**: Component and utility function testing
- **Component Testing**: Vue Test Utils for component behavior testing
- **Integration Testing**: API integration and workflow testing
- **E2E Testing**: End-to-end testing with Cypress or Playwright
- **Performance Testing**: Load and performance testing for critical features

### Testing Implementation
```javascript
// Example component test structure
import { mount } from '@vue/test-utils'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(MyComponent)
    expect(wrapper.exists()).toBe(true)
  })
  
  it('emits events correctly', async () => {
    const wrapper = mount(MyComponent)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```



### Testing Tools
- **Vitest**: Fast unit testing framework compatible with Vite
- **Vue Test Utils**: Official testing utilities for Vue components
- **Cypress**: End-to-end testing framework
- **Testing Library**: User-centric testing utilities
- **MSW**: Mock Service Worker for API mocking

### Code Coverage
- Target coverage: 80%+ for critical features
- Coverage reports generated with `npm run test:coverage`
- Excluded files: vendor libraries, test utilities, and mock data
- Coverage tracking in CI/CD pipeline

## 🎯 Advanced Features

### AI Model Sandbox Capabilities
- **Model Training Pipeline**: Complete workflow from data preparation to model deployment
- **Hyperparameter Tuning**: Advanced parameter optimization with automated search
- **Cross-Validation**: Robust model evaluation with k-fold cross-validation
- **Model Versioning**: Comprehensive model versioning and rollback capabilities
- **AutoML Integration**: Automated machine learning pipeline support

### Data Management Features
- **Data Version Control**: Git-like versioning for datasets and models
- **Data Lineage Tracking**: Complete data provenance tracking from source to output
- **Data Quality Metrics**: Automated data quality assessment and reporting
- **Data Privacy Protection**: GDPR-compliant data handling and anonymization
- **Data Federation**: Distributed data access and processing capabilities

### Advanced Visualization
- **Real-time Dashboards**: Live monitoring of model training and evaluation
- **Interactive Charts**: ECharts integration with zoom, pan, and drill-down capabilities
- **Graph Networks**: X6-based interactive graph visualization for model relationships
- **Formula Editor**: Advanced mathematical formula creation with syntax highlighting
- **Custom Visualization**: Plugin system for custom chart components

### Collaboration Features
- **Real-time Collaboration**: WebSocket-based real-time updates and collaboration
- **Comment System**: Inline comments and discussions on models and datasets
- **Activity Feed**: Real-time activity tracking and notifications
- **Team Management**: Role-based access control and team organization
- **Knowledge Base**: Integrated documentation and wiki system

## 🛡️ Security Features

### Authentication & Authorization
- **JWT Token Management**: Secure token-based authentication with automatic refresh
- **Role-Based Access Control**: Granular permissions based on user roles
- **Session Management**: Secure session handling with timeout controls
- **Multi-Factor Authentication**: Optional 2FA support for enhanced security
- **SSO Integration**: Single sign-on with enterprise identity providers

### Data Security
- **Encryption**: End-to-end encryption for sensitive data at rest and in transit
- **Audit Logging**: Comprehensive audit trail for all data access and modifications
- **Data Masking**: Dynamic data masking for sensitive information
- **Access Control**: Fine-grained access control at dataset and model levels
- **Backup & Recovery**: Automated backup and disaster recovery capabilities

## 🔄 Integration Capabilities

### External System Integration
- **Git Integration**: Version control integration for model and dataset metadata
- **CI/CD Pipeline**: Automated deployment and testing pipeline integration
- **Cloud Providers**: Multi-cloud deployment support (AWS, Azure, GCP)
- **Container Orchestration**: Docker and Kubernetes deployment support
- **Monitoring Systems**: Integration with Prometheus, Grafana, and ELK stack

### API Ecosystem
- **RESTful APIs**: Comprehensive REST API for all platform functionality
- **GraphQL Support**: Optional GraphQL endpoint for flexible data queries
- **Webhook Support**: Event-driven architecture with webhook notifications
- **SDK Support**: Client libraries for Python, JavaScript, and popular ML frameworks
- **OpenAPI Documentation**: Auto-generated API documentation with interactive testing

## 📊 Monitoring & Analytics

### Platform Monitoring
- **Real-time Metrics**: Live monitoring of system performance and resource usage
- **Health Checks**: Automated health checks for all services and dependencies
- **Error Tracking**: Comprehensive error tracking and alerting
- **Performance Monitoring**: Application performance monitoring (APM)
- **User Analytics**: User behavior analytics and usage patterns

### Model Performance Analytics
- **Training Metrics**: Real-time tracking of training accuracy, loss, and performance
- **Evaluation Reports**: Comprehensive model evaluation with multiple metrics
- **Comparison Tools**: Side-by-side model comparison and benchmarking
- **Performance Dashboard**: Interactive dashboard for model performance monitoring
- **Alert System**: Automated alerts for model performance degradation

## 🎨 User Experience

### Interface Design
- **Responsive Design**: Mobile-first responsive design for all screen sizes
- **Dark Mode**: System-aware dark/light theme support
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation and screen reader support
- **Progressive Enhancement**: Graceful degradation for older browsers
- **Loading States**: Comprehensive loading states and skeleton screens

### User Workflow Optimization
- **Wizard Interfaces**: Step-by-step wizards for complex operations
- **Bulk Operations**: Efficient bulk operations for large datasets
- **Keyboard Shortcuts**: Comprehensive keyboard shortcut support
- **Drag & Drop**: Intuitive drag-and-drop interfaces for data and model management
- **Search & Filter**: Advanced search with faceted filtering and saved searches
## 🔍 Testing

### Testing Strategy
- **Unit Testing**: Component and utility function testing
- **Component Testing**: Vue Test Utils for component behavior testing
- **Integration Testing**: API integration and workflow testing
- **E2E Testing**: End-to-end testing with Cypress or Playwright
- **Performance Testing**: Load and performance testing for critical features

### Testing Implementation
```javascript
// Example component test structure
import { mount } from '@vue/test-utils'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(MyComponent)
    expect(wrapper.exists()).toBe(true)
  })
  
  it('emits events correctly', async () => {
    const wrapper = mount(MyComponent)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```

### Mock Data Testing
- Comprehensive mock data generation using Mock.js
- Realistic API responses for development and testing
- Configurable mock scenarios for edge cases
- Type-safe mock data with TypeScript interfaces

### Testing Tools
- **Vitest**: Fast unit testing framework compatible with Vite
- **Vue Test Utils**: Official testing utilities for Vue components
- **Cypress**: End-to-end testing framework
- **Testing Library**: User-centric testing utilities
- **MSW**: Mock Service Worker for API mocking

### Code Coverage
- Target coverage: 80%+ for critical features
- Coverage reports generated with `npm run test:coverage`
- Excluded files: vendor libraries, test utilities, and mock data
- Coverage tracking in CI/CD pipeline

## 🎯 Advanced Features

### AI Model Sandbox Capabilities
- **Model Training Pipeline**: Complete workflow from data preparation to model deployment
- **Hyperparameter Tuning**: Advanced parameter optimization with automated search
- **Cross-Validation**: Robust model evaluation with k-fold cross-validation
- **Model Versioning**: Comprehensive model versioning and rollback capabilities
- **AutoML Integration**: Automated machine learning pipeline support

### Data Management Features
- **Data Version Control**: Git-like versioning for datasets and models
- **Data Lineage Tracking**: Complete data provenance tracking from source to output
- **Data Quality Metrics**: Automated data quality assessment and reporting
- **Data Privacy Protection**: GDPR-compliant data handling and anonymization
- **Data Federation**: Distributed data access and processing capabilities

### Advanced Visualization
- **Real-time Dashboards**: Live monitoring of model training and evaluation
- **Interactive Charts**: ECharts integration with zoom, pan, and drill-down capabilities
- **Graph Networks**: X6-based interactive graph visualization for model relationships
- **Formula Editor**: Advanced mathematical formula creation with syntax highlighting
- **Custom Visualization**: Plugin system for custom chart components

### Collaboration Features
- **Real-time Collaboration**: WebSocket-based real-time updates and collaboration
- **Comment System**: Inline comments and discussions on models and datasets
- **Activity Feed**: Real-time activity tracking and notifications
- **Team Management**: Role-based access control and team organization
- **Knowledge Base**: Integrated documentation and wiki system

## 🛡️ Security Features

### Authentication & Authorization
- **JWT Token Management**: Secure token-based authentication with automatic refresh
- **Role-Based Access Control**: Granular permissions based on user roles
- **Session Management**: Secure session handling with timeout controls
- **Multi-Factor Authentication**: Optional 2FA support for enhanced security
- **SSO Integration**: Single sign-on with enterprise identity providers

### Data Security
- **Encryption**: End-to-end encryption for sensitive data at rest and in transit
- **Audit Logging**: Comprehensive audit trail for all data access and modifications
- **Data Masking**: Dynamic data masking for sensitive information
- **Access Control**: Fine-grained access control at dataset and model levels
- **Backup & Recovery**: Automated backup and disaster recovery capabilities

## 🔄 Integration Capabilities

### External System Integration
- **Git Integration**: Version control integration for model and dataset metadata
- **CI/CD Pipeline**: Automated deployment and testing pipeline integration
- **Cloud Providers**: Multi-cloud deployment support (AWS, Azure, GCP)
- **Container Orchestration**: Docker and Kubernetes deployment support
- **Monitoring Systems**: Integration with Prometheus, Grafana, and ELK stack

### API Ecosystem
- **RESTful APIs**: Comprehensive REST API for all platform functionality
- **GraphQL Support**: Optional GraphQL endpoint for flexible data queries
- **Webhook Support**: Event-driven architecture with webhook notifications
- **SDK Support**: Client libraries for Python, JavaScript, and popular ML frameworks
- **OpenAPI Documentation**: Auto-generated API documentation with interactive testing

## 📊 Monitoring & Analytics

### Platform Monitoring
- **Real-time Metrics**: Live monitoring of system performance and resource usage
- **Health Checks**: Automated health checks for all services and dependencies
- **Error Tracking**: Comprehensive error tracking and alerting
- **Performance Monitoring**: Application performance monitoring (APM)
- **User Analytics**: User behavior analytics and usage patterns

### Model Performance Analytics
- **Training Metrics**: Real-time tracking of training accuracy, loss, and performance
- **Evaluation Reports**: Comprehensive model evaluation with multiple metrics
- **Comparison Tools**: Side-by-side model comparison and benchmarking
- **Performance Dashboard**: Interactive dashboard for model performance monitoring
- **Alert System**: Automated alerts for model performance degradation

## 🎨 User Experience

### Interface Design
- **Responsive Design**: Mobile-first responsive design for all screen sizes
- **Dark Mode**: System-aware dark/light theme support
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation and screen reader support
- **Progressive Enhancement**: Graceful degradation for older browsers
- **Loading States**: Comprehensive loading states and skeleton screens

### User Workflow Optimization
- **Wizard Interfaces**: Step-by-step wizards for complex operations
- **Bulk Operations**: Efficient bulk operations for large datasets
- **Keyboard Shortcuts**: Comprehensive keyboard shortcut support
- **Drag & Drop**: Intuitive drag-and-drop interfaces for data and model management


### 业务分析主题：


| 字段名 | 数据类型 | 是否必填 | 说明 |
|--------|----------|----------|------|
| **domainCode** | string | 是 | 主题域编码：业务分析主题的唯一标识符，采用大写英文缩写 |
| **domainName** | string | 是 | 主题域名称：业务分析主题的中文描述名称 |
| **domainDescription** | string | 是 | 主题域描述：详细说明该业务分析主题的范围、目的和业务价值 |
| **businessOwner** | string | 是 | 业务归属部门：负责该主题域业务管理和数据准确性的责任部门 |
| **dataSteward** | string | 是 | 数据治理责任人：负责该主题域数据质量、标准和治理的具体责任人 |
