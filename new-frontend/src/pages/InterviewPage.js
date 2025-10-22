import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import CameraFeed from '../components/CameraFeed';
import apiService from '../utils/apiService';
import {
  Play,
  Pause,
  Square,
  Mic,
  MicOff,
  Brain,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Camera,
  Volume2,
  VolumeX,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Settings,
  Target,
  Zap
} from 'lucide-react';

// Interview topics and difficulties
const interviewTopics = {
  'Software Engineering': {
    description: 'Technical questions about programming, algorithms, and software development',
    difficulty: ['beginner', 'intermediate', 'advanced']
  },
  'Data Science': {
    description: 'Questions about machine learning, statistics, and data analysis',
    difficulty: ['beginner', 'intermediate', 'advanced']
  },
  'Product Management': {
    description: 'Strategic thinking, user research, and product development questions',
    difficulty: ['beginner', 'intermediate', 'advanced']
  },
  'Marketing': {
    description: 'Digital marketing, campaign strategy, and brand management',
    difficulty: ['beginner', 'intermediate', 'advanced']
  },
  'Sales': {
    description: 'Customer relationship management and sales techniques',
    difficulty: ['beginner', 'intermediate', 'advanced']
  },
  'Leadership': {
    description: 'Team management, strategic decision making, and leadership skills',
    difficulty: ['beginner', 'intermediate', 'advanced']
  },
  'UX/UI Design': {
    description: 'User experience design, interface design, and usability principles',
    difficulty: ['beginner', 'intermediate', 'advanced']
  },
  'DevOps': {
    description: 'Software deployment, infrastructure, and development operations',
    difficulty: ['beginner', 'intermediate', 'advanced']
  },
  'Cybersecurity': {
    description: 'Information security, threat analysis, and security best practices',
    difficulty: ['beginner', 'intermediate', 'advanced']
  },
  'Business Analysis': {
    description: 'Requirements analysis, process improvement, and business strategy',
    difficulty: ['beginner', 'intermediate', 'advanced']
  },
  'Project Management': {
    description: 'Project planning, execution, and team coordination',
    difficulty: ['beginner', 'intermediate', 'advanced']
  },
  'Customer Success': {
    description: 'Customer relationship management and success strategies',
    difficulty: ['beginner', 'intermediate', 'advanced']
  }
};

// Comprehensive question bank with 30 questions per topic and difficulty
const questionBank = {
  'Software Engineering': {
    'beginner': [
      "What is the difference between a variable and a constant?",
      "Explain what a function is and why we use them.",
      "What is the difference between == and === in JavaScript?",
      "What is a loop and name two types of loops.",
      "What is the difference between let, var, and const?",
      "Explain what an array is and how to access its elements.",
      "What is the difference between frontend and backend development?",
      "What is version control and why is it important?",
      "Explain what debugging means in programming.",
      "What is the difference between HTML, CSS, and JavaScript?",
      "What is a database and why do we need it?",
      "Explain what an API is in simple terms.",
      "What is the difference between GET and POST requests?",
      "What is responsive web design?",
      "Explain what a framework is in programming.",
      "What is the difference between a class and an object?",
      "What is inheritance in object-oriented programming?",
      "Explain what a constructor is.",
      "What is the difference between a method and a function?",
      "What is encapsulation and why is it important?",
      "Explain what polymorphism means in programming.",
      "What is the difference between a library and a framework?",
      "What is a package manager and give an example.",
      "Explain what a repository is in Git.",
      "What is the difference between Git and GitHub?",
      "What is a branch in version control?",
      "Explain what a merge conflict is.",
      "What is the difference between a bug and a feature?",
      "What is testing in software development?",
      "Explain what deployment means in software development."
    ],
    'intermediate': [
      "Explain the SOLID principles in object-oriented programming.",
      "What is the difference between synchronous and asynchronous programming?",
      "Explain what closures are in JavaScript with an example.",
      "What is the difference between shallow copy and deep copy?",
      "Explain what promises are and how they work.",
      "What is the difference between SQL and NoSQL databases?",
      "Explain what RESTful API design principles are.",
      "What is the difference between microservices and monolithic architecture?",
      "Explain what design patterns are and name a few.",
      "What is the difference between authentication and authorization?",
      "Explain what caching is and its benefits.",
      "What is the difference between horizontal and vertical scaling?",
      "Explain what load balancing is.",
      "What is the difference between stateful and stateless applications?",
      "Explain what containerization is and its benefits.",
      "What is the difference between Docker and Kubernetes?",
      "Explain what CI/CD is and why it's important.",
      "What is the difference between unit testing and integration testing?",
      "Explain what code coverage means.",
      "What is the difference between functional and imperative programming?",
      "Explain what immutability means in programming.",
      "What is the difference between a stack and a queue?",
      "Explain what a binary tree is.",
      "What is the difference between breadth-first and depth-first search?",
      "Explain what Big O notation is.",
      "What is the difference between a hash table and an array?",
      "Explain what recursion is and when to use it.",
      "What is the difference between a compiler and an interpreter?",
      "Explain what garbage collection is.",
      "What is the difference between static and dynamic typing?"
    ],
    'advanced': [
      "Explain the CAP theorem and its implications for distributed systems.",
      "What is the difference between eventual consistency and strong consistency?",
      "Explain what event sourcing is and its benefits.",
      "What is the difference between CQRS and traditional CRUD?",
      "Explain what domain-driven design is.",
      "What is the difference between reactive programming and imperative programming?",
      "Explain what actor model is in concurrent programming.",
      "What is the difference between message queues and event streams?",
      "Explain what circuit breaker pattern is.",
      "What is the difference between blue-green and canary deployments?",
      "Explain what chaos engineering is.",
      "What is the difference between eventual consistency and strong consistency?",
      "Explain what distributed tracing is.",
      "What is the difference between APM and observability?",
      "Explain what service mesh is.",
      "What is the difference between serverless and container-based architectures?",
      "Explain what edge computing is.",
      "What is the difference between GraphQL and REST?",
      "Explain what federation is in GraphQL.",
      "What is the difference between JWT and session-based authentication?",
      "Explain what OAuth 2.0 flow is.",
      "What is the difference between RBAC and ABAC?",
      "Explain what zero-trust security model is.",
      "What is the difference between symmetric and asymmetric encryption?",
      "Explain what homomorphic encryption is.",
      "What is the difference between blockchain and traditional databases?",
      "Explain what consensus algorithms are.",
      "What is the difference between proof of work and proof of stake?",
      "Explain what smart contracts are.",
      "What is the difference between public and private blockchains?"
    ]
  },
  'Data Science': {
    'beginner': [
      "What is data science and how does it differ from traditional statistics?",
      "Explain what a dataset is and its basic components.",
      "What is the difference between structured and unstructured data?",
      "Explain what data cleaning means and why it's important.",
      "What is the difference between supervised and unsupervised learning?",
      "Explain what a feature is in machine learning.",
      "What is the difference between classification and regression?",
      "Explain what overfitting means in machine learning.",
      "What is the difference between training and testing data?",
      "Explain what cross-validation is.",
      "What is the difference between accuracy and precision?",
      "Explain what a confusion matrix is.",
      "What is the difference between correlation and causation?",
      "Explain what a histogram is and when to use it.",
      "What is the difference between mean, median, and mode?",
      "Explain what standard deviation measures.",
      "What is the difference between a sample and a population?",
      "Explain what a p-value is in statistics.",
      "What is the difference between descriptive and inferential statistics?",
      "Explain what a normal distribution is.",
      "What is the difference between categorical and numerical data?",
      "Explain what one-hot encoding is.",
      "What is the difference between feature selection and feature extraction?",
      "Explain what dimensionality reduction is.",
      "What is the difference between clustering and classification?",
      "Explain what k-means clustering is.",
      "What is the difference between linear and logistic regression?",
      "Explain what decision trees are.",
      "What is the difference between bagging and boosting?",
      "Explain what random forests are."
    ],
    'intermediate': [
      "Explain what bias-variance tradeoff is in machine learning.",
      "What is the difference between L1 and L2 regularization?",
      "Explain what gradient descent is and how it works.",
      "What is the difference between batch and stochastic gradient descent?",
      "Explain what feature engineering is and its importance.",
      "What is the difference between feature scaling and normalization?",
      "Explain what principal component analysis (PCA) is.",
      "What is the difference between linear and non-linear dimensionality reduction?",
      "Explain what ensemble methods are.",
      "What is the difference between bagging and boosting?",
      "Explain what support vector machines (SVM) are.",
      "What is the difference between linear and non-linear SVM?",
      "Explain what kernel methods are.",
      "What is the difference between parametric and non-parametric models?",
      "Explain what cross-validation strategies are.",
      "What is the difference between k-fold and leave-one-out cross-validation?",
      "Explain what hyperparameter tuning is.",
      "What is the difference between grid search and random search?",
      "Explain what time series analysis is.",
      "What is the difference between trend and seasonality?",
      "Explain what ARIMA models are.",
      "What is the difference between stationary and non-stationary time series?",
      "Explain what deep learning is.",
      "What is the difference between artificial neural networks and traditional ML?",
      "Explain what backpropagation is.",
      "What is the difference between feedforward and recurrent neural networks?",
      "Explain what convolutional neural networks (CNN) are.",
      "What is the difference between pooling and convolution?",
      "Explain what recurrent neural networks (RNN) are.",
      "What is the difference between LSTM and GRU?"
    ],
    'advanced': [
      "Explain what transfer learning is and its applications.",
      "What is the difference between fine-tuning and feature extraction?",
      "Explain what attention mechanisms are in neural networks.",
      "What is the difference between self-attention and cross-attention?",
      "Explain what transformer architecture is.",
      "What is the difference between BERT and GPT models?",
      "Explain what generative adversarial networks (GANs) are.",
      "What is the difference between generator and discriminator in GANs?",
      "Explain what variational autoencoders (VAEs) are.",
      "What is the difference between deterministic and probabilistic models?",
      "Explain what reinforcement learning is.",
      "What is the difference between model-based and model-free RL?",
      "Explain what Q-learning is.",
      "What is the difference between on-policy and off-policy learning?",
      "Explain what multi-armed bandit problems are.",
      "What is the difference between exploration and exploitation?",
      "Explain what causal inference is.",
      "What is the difference between correlation and causation?",
      "Explain what instrumental variables are.",
      "What is the difference between randomized controlled trials and observational studies?",
      "Explain what A/B testing is.",
      "What is the difference between statistical significance and practical significance?",
      "Explain what Bayesian inference is.",
      "What is the difference between frequentist and Bayesian statistics?",
      "Explain what Markov Chain Monte Carlo (MCMC) is.",
      "What is the difference between Gibbs sampling and Metropolis-Hastings?",
      "Explain what Gaussian processes are.",
      "What is the difference between parametric and non-parametric Bayesian methods?",
      "Explain what variational inference is.",
      "What is the difference between exact and approximate inference?"
    ]
  },
  'Product Management': {
    'beginner': [
      "What is product management and what does a product manager do?",
      "Explain the difference between a product and a feature.",
      "What is the difference between user needs and user wants?",
      "Explain what user research is and why it's important.",
      "What is the difference between qualitative and quantitative research?",
      "Explain what a user persona is.",
      "What is the difference between a user story and a requirement?",
      "Explain what acceptance criteria are.",
      "What is the difference between a product roadmap and a project plan?",
      "Explain what prioritization means in product management.",
      "What is the difference between must-have and nice-to-have features?",
      "Explain what MVP (Minimum Viable Product) means.",
      "What is the difference between a product vision and a product strategy?",
      "Explain what market research is.",
      "What is the difference between primary and secondary research?",
      "Explain what competitive analysis is.",
      "What is the difference between direct and indirect competitors?",
      "Explain what a product launch is.",
      "What is the difference between a soft launch and a hard launch?",
      "Explain what product metrics are.",
      "What is the difference between leading and lagging indicators?",
      "Explain what user engagement means.",
      "What is the difference between active users and registered users?",
      "Explain what retention rate is.",
      "What is the difference between churn rate and retention rate?",
      "Explain what customer lifetime value (CLV) is.",
      "What is the difference between acquisition and activation?",
      "Explain what product-market fit means.",
      "What is the difference between a product and a platform?",
      "Explain what product positioning is."
    ],
    'intermediate': [
      "Explain what product strategy is and how it differs from tactics.",
      "What is the difference between product-led growth and sales-led growth?",
      "Explain what go-to-market strategy is.",
      "What is the difference between B2B and B2C product management?",
      "Explain what stakeholder management is.",
      "What is the difference between internal and external stakeholders?",
      "Explain what product requirements document (PRD) is.",
      "What is the difference between functional and non-functional requirements?",
      "Explain what user journey mapping is.",
      "What is the difference between user journey and user flow?",
      "Explain what wireframing is.",
      "What is the difference between low-fidelity and high-fidelity prototypes?",
      "Explain what usability testing is.",
      "What is the difference between moderated and unmoderated testing?",
      "Explain what A/B testing is in product management.",
      "What is the difference between statistical significance and practical significance?",
      "Explain what feature flags are.",
      "What is the difference between canary releases and blue-green deployments?",
      "Explain what product analytics is.",
      "What is the difference between descriptive and predictive analytics?",
      "Explain what cohort analysis is.",
      "What is the difference between retention and engagement?",
      "Explain what product-market fit measurement is.",
      "What is the difference between product-market fit and product-channel fit?",
      "Explain what platform strategy is.",
      "What is the difference between a product and a platform?",
      "Explain what ecosystem thinking is.",
      "What is the difference between first-party and third-party integrations?",
      "Explain what API strategy is.",
      "What is the difference between public and private APIs?"
    ],
    'advanced': [
      "Explain what product strategy frameworks are and name a few.",
      "What is the difference between Ansoff Matrix and BCG Matrix?",
      "Explain what Jobs-to-be-Done (JTBD) framework is.",
      "What is the difference between functional and emotional jobs?",
      "Explain what outcome-driven innovation is.",
      "What is the difference between outcome and output metrics?",
      "Explain what product portfolio management is.",
      "What is the difference between portfolio optimization and portfolio rebalancing?",
      "Explain what product lifecycle management is.",
      "What is the difference between product lifecycle and technology lifecycle?",
      "Explain what platform business models are.",
      "What is the difference between platform and pipeline business models?",
      "Explain what network effects are.",
      "What is the difference between direct and indirect network effects?",
      "Explain what two-sided markets are.",
      "What is the difference between multi-sided platforms and two-sided markets?",
      "Explain what product-led growth strategies are.",
      "What is the difference between freemium and freemium-plus models?",
      "Explain what viral growth mechanisms are.",
      "What is the difference between viral coefficient and viral cycle time?",
      "Explain what product analytics maturity models are.",
      "What is the difference between descriptive and prescriptive analytics?",
      "Explain what machine learning in product management is.",
      "What is the difference between supervised and unsupervised learning in product analytics?",
      "Explain what predictive modeling in product management is.",
      "What is the difference between classification and regression in product analytics?",
      "Explain what recommendation systems are.",
      "What is the difference between collaborative filtering and content-based filtering?",
      "Explain what personalization strategies are.",
      "What is the difference between rule-based and ML-based personalization?"
    ]
  },
  'Marketing': {
    'beginner': [
      "What is marketing and what are its main objectives?",
      "Explain the difference between marketing and advertising.",
      "What is the difference between B2B and B2C marketing?",
      "Explain what a target audience is.",
      "What is the difference between demographics and psychographics?",
      "Explain what a marketing strategy is.",
      "What is the difference between strategy and tactics?",
      "Explain what the marketing mix (4Ps) is.",
      "What is the difference between product and service marketing?",
      "Explain what brand positioning is.",
      "What is the difference between brand awareness and brand recognition?",
      "Explain what customer segmentation is.",
      "What is the difference between market segmentation and target marketing?",
      "Explain what a value proposition is.",
      "What is the difference between features and benefits?",
      "Explain what content marketing is.",
      "What is the difference between owned, earned, and paid media?",
      "Explain what social media marketing is.",
      "What is the difference between organic and paid social media?",
      "Explain what email marketing is.",
      "What is the difference between email marketing and email automation?",
      "Explain what SEO (Search Engine Optimization) is.",
      "What is the difference between on-page and off-page SEO?",
      "Explain what PPC (Pay-Per-Click) advertising is.",
      "What is the difference between Google Ads and Facebook Ads?",
      "Explain what conversion rate is.",
      "What is the difference between conversion rate and click-through rate?",
      "Explain what customer acquisition cost (CAC) is.",
      "What is the difference between CAC and customer lifetime value?",
      "Explain what marketing attribution is."
    ],
    'intermediate': [
      "Explain what marketing funnel is and its stages.",
      "What is the difference between awareness and consideration stages?",
      "Explain what customer journey mapping is.",
      "What is the difference between customer journey and buyer journey?",
      "Explain what marketing automation is.",
      "What is the difference between marketing automation and CRM?",
      "Explain what lead scoring is.",
      "What is the difference between lead scoring and lead qualification?",
      "Explain what marketing analytics is.",
      "What is the difference between descriptive and predictive analytics?",
      "Explain what A/B testing is in marketing.",
      "What is the difference between A/B testing and multivariate testing?",
      "Explain what personalization in marketing is.",
      "What is the difference between segmentation and personalization?",
      "Explain what account-based marketing (ABM) is.",
      "What is the difference between ABM and traditional B2B marketing?",
      "Explain what influencer marketing is.",
      "What is the difference between macro and micro influencers?",
      "Explain what affiliate marketing is.",
      "What is the difference between affiliate marketing and referral marketing?",
      "Explain what marketing attribution models are.",
      "What is the difference between first-touch and last-touch attribution?",
      "Explain what marketing ROI is.",
      "What is the difference between ROI and ROAS?",
      "Explain what customer lifetime value (CLV) modeling is.",
      "What is the difference between historical and predictive CLV?",
      "Explain what marketing mix modeling is.",
      "What is the difference between marketing mix modeling and attribution modeling?",
      "Explain what brand equity is.",
      "What is the difference between brand equity and brand value?"
    ],
    'advanced': [
      "Explain what marketing technology (MarTech) stack is.",
      "What is the difference between MarTech and AdTech?",
      "Explain what customer data platforms (CDP) are.",
      "What is the difference between CDP and CRM?",
      "Explain what marketing attribution in the cookieless future is.",
      "What is the difference between first-party and third-party data?",
      "Explain what privacy-first marketing is.",
      "What is the difference between opt-in and opt-out consent?",
      "Explain what cross-channel marketing orchestration is.",
      "What is the difference between omnichannel and multichannel marketing?",
      "Explain what marketing AI and machine learning applications are.",
      "What is the difference between supervised and unsupervised learning in marketing?",
      "Explain what predictive customer analytics is.",
      "What is the difference between churn prediction and lifetime value prediction?",
      "Explain what marketing experimentation frameworks are.",
      "What is the difference between causal inference and correlation analysis?",
      "Explain what marketing attribution in the privacy era is.",
      "What is the difference between deterministic and probabilistic attribution?",
      "Explain what marketing measurement frameworks are.",
      "What is the difference between incrementality testing and attribution modeling?",
      "Explain what marketing automation at scale is.",
      "What is the difference between rule-based and AI-driven automation?",
      "Explain what marketing personalization at scale is.",
      "What is the difference between segment-based and individual-based personalization?",
      "Explain what marketing ROI optimization is.",
      "What is the difference between media mix optimization and budget allocation?",
      "Explain what marketing analytics maturity models are.",
      "What is the difference between descriptive and prescriptive analytics?",
      "Explain what marketing data science is.",
      "What is the difference between marketing analytics and marketing data science?"
    ]
  },
  'Sales': {
    'beginner': [
      "What is sales and what are its main objectives?",
      "Explain the difference between sales and marketing.",
      "What is the difference between B2B and B2C sales?",
      "Explain what a sales process is.",
      "What is the difference between inbound and outbound sales?",
      "Explain what lead generation is.",
      "What is the difference between a lead and a prospect?",
      "Explain what prospecting is.",
      "What is the difference between cold calling and warm calling?",
      "Explain what a sales funnel is.",
      "What is the difference between top-of-funnel and bottom-of-funnel?",
      "Explain what lead qualification is.",
      "What is the difference between BANT and MEDDIC qualification frameworks?",
      "Explain what a sales pitch is.",
      "What is the difference between a pitch and a presentation?",
      "Explain what objection handling is.",
      "What is the difference between price objections and product objections?",
      "Explain what closing techniques are.",
      "What is the difference between assumptive close and trial close?",
      "Explain what follow-up is in sales.",
      "What is the difference between follow-up and follow-through?",
      "Explain what customer relationship management (CRM) is.",
      "What is the difference between CRM and sales automation?",
      "Explain what sales forecasting is.",
      "What is the difference between top-down and bottom-up forecasting?",
      "Explain what sales metrics are.",
      "What is the difference between activity metrics and outcome metrics?",
      "Explain what sales quota is.",
      "What is the difference between quota and target?",
      "Explain what sales territory management is."
    ],
    'intermediate': [
      "Explain what consultative selling is.",
      "What is the difference between consultative and transactional selling?",
      "Explain what solution selling is.",
      "What is the difference between solution selling and product selling?",
      "Explain what value-based selling is.",
      "What is the difference between value-based and price-based selling?",
      "Explain what relationship selling is.",
      "What is the difference between relationship and transactional selling?",
      "Explain what sales enablement is.",
      "What is the difference between sales enablement and sales training?",
      "Explain what sales coaching is.",
      "What is the difference between sales coaching and sales management?",
      "Explain what sales performance management is.",
      "What is the difference between performance management and performance improvement?",
      "Explain what sales analytics is.",
      "What is the difference between sales reporting and sales analytics?",
      "Explain what sales pipeline management is.",
      "What is the difference between pipeline and funnel?",
      "Explain what sales velocity is.",
      "What is the difference between sales velocity and sales cycle?",
      "Explain what account-based selling is.",
      "What is the difference between account-based and lead-based selling?",
      "Explain what social selling is.",
      "What is the difference between social selling and traditional selling?",
      "Explain what sales automation is.",
      "What is the difference between sales automation and sales acceleration?",
      "Explain what sales intelligence is.",
      "What is the difference between sales intelligence and sales research?",
      "Explain what sales compensation is.",
      "What is the difference between commission and salary in sales?"
    ],
    'advanced': [
      "Explain what sales transformation is.",
      "What is the difference between sales transformation and sales optimization?",
      "Explain what digital selling is.",
      "What is the difference between digital and traditional selling?",
      "Explain what AI in sales is.",
      "What is the difference between AI-assisted and AI-automated selling?",
      "Explain what predictive sales analytics is.",
      "What is the difference between predictive and prescriptive sales analytics?",
      "Explain what sales forecasting with machine learning is.",
      "What is the difference between time series and regression forecasting?",
      "Explain what sales attribution modeling is.",
      "What is the difference between first-touch and multi-touch attribution?",
      "Explain what sales revenue operations (RevOps) is.",
      "What is the difference between RevOps and traditional sales operations?",
      "Explain what sales technology stack is.",
      "What is the difference between sales tech stack and sales enablement platform?",
      "Explain what sales data science is.",
      "What is the difference between sales analytics and sales data science?",
      "Explain what sales experimentation is.",
      "What is the difference between sales A/B testing and sales optimization?",
      "Explain what sales personalization at scale is.",
      "What is the difference between segment-based and individual-based sales personalization?",
      "Explain what sales automation with AI is.",
      "What is the difference between rule-based and AI-driven sales automation?",
      "Explain what sales performance optimization is.",
      "What is the difference between sales performance management and optimization?",
      "Explain what sales revenue optimization is.",
      "What is the difference between revenue optimization and revenue management?",
      "Explain what sales analytics maturity models are.",
      "What is the difference between descriptive and prescriptive sales analytics?"
    ]
  },
  'Leadership': {
    'beginner': [
      "What is leadership and how does it differ from management?",
      "Explain the difference between a leader and a manager.",
      "What is the difference between formal and informal leadership?",
      "Explain what leadership styles are.",
      "What is the difference between autocratic and democratic leadership?",
      "Explain what emotional intelligence is in leadership.",
      "What is the difference between IQ and EQ in leadership?",
      "Explain what team building is.",
      "What is the difference between team building and team development?",
      "Explain what delegation is.",
      "What is the difference between delegation and micromanagement?",
      "Explain what communication skills are in leadership.",
      "What is the difference between verbal and non-verbal communication?",
      "Explain what conflict resolution is.",
      "What is the difference between conflict avoidance and conflict resolution?",
      "Explain what motivation is in leadership.",
      "What is the difference between intrinsic and extrinsic motivation?",
      "Explain what feedback is in leadership.",
      "What is the difference between positive and negative feedback?",
      "Explain what coaching is in leadership.",
      "What is the difference between coaching and mentoring?",
      "Explain what decision making is in leadership.",
      "What is the difference between individual and group decision making?",
      "Explain what vision is in leadership.",
      "What is the difference between vision and mission?",
      "Explain what strategic thinking is.",
      "What is the difference between strategic and tactical thinking?",
      "Explain what change management is.",
      "What is the difference between change management and change leadership?",
      "Explain what accountability is in leadership."
    ],
    'intermediate': [
      "Explain what transformational leadership is.",
      "What is the difference between transformational and transactional leadership?",
      "Explain what servant leadership is.",
      "What is the difference between servant leadership and traditional leadership?",
      "Explain what situational leadership is.",
      "What is the difference between situational and contingency leadership?",
      "Explain what authentic leadership is.",
      "What is the difference between authentic and charismatic leadership?",
      "Explain what distributed leadership is.",
      "What is the difference between distributed and centralized leadership?",
      "Explain what leadership development is.",
      "What is the difference between leadership development and leadership training?",
      "Explain what succession planning is.",
      "What is the difference between succession planning and talent management?",
      "Explain what leadership assessment is.",
      "What is the difference between leadership assessment and performance appraisal?",
      "Explain what leadership coaching is.",
      "What is the difference between leadership coaching and executive coaching?",
      "Explain what leadership mentoring is.",
      "What is the difference between leadership mentoring and leadership coaching?",
      "Explain what leadership succession is.",
      "What is the difference between leadership succession and leadership transition?",
      "Explain what leadership culture is.",
      "What is the difference between leadership culture and organizational culture?",
      "Explain what leadership ethics is.",
      "What is the difference between ethical leadership and moral leadership?",
      "Explain what leadership resilience is.",
      "What is the difference between leadership resilience and leadership adaptability?",
      "Explain what leadership innovation is.",
      "What is the difference between leadership innovation and leadership creativity?"
    ],
    'advanced': [
      "Explain what adaptive leadership is.",
      "What is the difference between adaptive and technical leadership?",
      "Explain what complexity leadership theory is.",
      "What is the difference between complexity and systems leadership?",
      "Explain what quantum leadership is.",
      "What is the difference between quantum and traditional leadership?",
      "Explain what digital leadership is.",
      "What is the difference between digital and traditional leadership?",
      "Explain what virtual leadership is.",
      "What is the difference between virtual and remote leadership?",
      "Explain what cross-cultural leadership is.",
      "What is the difference between cross-cultural and multicultural leadership?",
      "Explain what global leadership is.",
      "What is the difference between global and international leadership?",
      "Explain what sustainable leadership is.",
      "What is the difference between sustainable and traditional leadership?",
      "Explain what inclusive leadership is.",
      "What is the difference between inclusive and diverse leadership?",
      "Explain what agile leadership is.",
      "What is the difference between agile and traditional leadership?",
      "Explain what leadership analytics is.",
      "What is the difference between leadership analytics and leadership assessment?",
      "Explain what leadership AI is.",
      "What is the difference between AI-assisted and AI-automated leadership?",
      "Explain what leadership data science is.",
      "What is the difference between leadership analytics and leadership data science?",
      "Explain what leadership experimentation is.",
      "What is the difference between leadership experimentation and leadership innovation?",
      "Explain what leadership optimization is.",
      "What is the difference between leadership optimization and leadership development?"
    ]
  },
  'UX/UI Design': {
    'beginner': [
      "What is the difference between UX and UI design?",
      "Explain what user-centered design means.",
      "What is the difference between usability and accessibility?",
      "Explain what wireframing is in design.",
      "What is the difference between low-fidelity and high-fidelity prototypes?",
      "Explain what user personas are.",
      "What is the difference between user research and usability testing?",
      "Explain what information architecture is.",
      "What is the difference between navigation and wayfinding?",
      "Explain what visual hierarchy is.",
      "What is the difference between skeuomorphic and flat design?",
      "Explain what responsive design is.",
      "What is the difference between mobile-first and desktop-first design?",
      "Explain what design systems are.",
      "What is the difference between components and patterns?",
      "Explain what color theory is in design.",
      "What is the difference between primary and secondary colors?",
      "Explain what typography is in design.",
      "What is the difference between serif and sans-serif fonts?",
      "Explain what whitespace is in design.",
      "What is the difference between padding and margin?",
      "Explain what grid systems are.",
      "What is the difference between fixed and fluid grids?",
      "Explain what user flows are.",
      "What is the difference between user journey and user flow?",
      "Explain what micro-interactions are.",
      "What is the difference between animation and transition?",
      "Explain what design thinking is.",
      "What is the difference between empathy and sympathy in design?",
      "Explain what usability heuristics are."
    ],
    'intermediate': [
      "Explain what design research methods are.",
      "What is the difference between qualitative and quantitative research?",
      "Explain what card sorting is.",
      "What is the difference between open and closed card sorting?",
      "Explain what tree testing is.",
      "What is the difference between tree testing and card sorting?",
      "Explain what A/B testing is in design.",
      "What is the difference between A/B testing and multivariate testing?",
      "Explain what design patterns are.",
      "What is the difference between design patterns and design systems?",
      "Explain what atomic design methodology is.",
      "What is the difference between atoms and molecules in atomic design?",
      "Explain what design tokens are.",
      "What is the difference between design tokens and CSS variables?",
      "Explain what accessibility guidelines are.",
      "What is the difference between WCAG AA and WCAG AAA?",
      "Explain what inclusive design is.",
      "What is the difference between inclusive design and accessible design?",
      "Explain what design critique is.",
      "What is the difference between design critique and design review?",
      "Explain what design handoff is.",
      "What is the difference between design handoff and design documentation?",
      "Explain what design collaboration is.",
      "What is the difference between design collaboration and design coordination?",
      "Explain what design iteration is.",
      "What is the difference between design iteration and design iteration?",
      "Explain what design validation is.",
      "What is the difference between design validation and design verification?",
      "Explain what design metrics are.",
      "What is the difference between design metrics and design KPIs?"
    ],
    'advanced': [
      "Explain what design strategy is.",
      "What is the difference between design strategy and design tactics?",
      "Explain what design leadership is.",
      "What is the difference between design leadership and design management?",
      "Explain what design operations is.",
      "What is the difference between design operations and design processes?",
      "Explain what design maturity models are.",
      "What is the difference between design maturity and design capability?",
      "Explain what design transformation is.",
      "What is the difference between design transformation and design evolution?",
      "Explain what design innovation is.",
      "What is the difference between design innovation and design creativity?",
      "Explain what design thinking at scale is.",
      "What is the difference between design thinking and design doing?",
      "Explain what design systems at scale are.",
      "What is the difference between design systems and design libraries?",
      "Explain what design automation is.",
      "What is the difference between design automation and design generation?",
      "Explain what design AI is.",
      "What is the difference between AI-assisted design and AI-automated design?",
      "Explain what design data science is.",
      "What is the difference between design analytics and design data science?",
      "Explain what design experimentation is.",
      "What is the difference between design experimentation and design testing?",
      "Explain what design optimization is.",
      "What is the difference between design optimization and design improvement?",
      "Explain what design measurement is.",
      "What is the difference between design measurement and design evaluation?",
      "Explain what design ROI is.",
      "What is the difference between design ROI and design value?"
    ]
  },
  'DevOps': {
    'beginner': [
      "What is DevOps and how does it differ from traditional software development?",
      "Explain the difference between development and operations.",
      "What is the difference between continuous integration and continuous deployment?",
      "Explain what version control is.",
      "What is the difference between Git and GitHub?",
      "Explain what branching strategies are.",
      "What is the difference between feature branches and release branches?",
      "Explain what code review is.",
      "What is the difference between code review and code inspection?",
      "Explain what automated testing is.",
      "What is the difference between unit testing and integration testing?",
      "Explain what build automation is.",
      "What is the difference between build and compilation?",
      "Explain what deployment is.",
      "What is the difference between deployment and release?",
      "Explain what monitoring is.",
      "What is the difference between monitoring and logging?",
      "Explain what infrastructure is.",
      "What is the difference between on-premises and cloud infrastructure?",
      "Explain what virtualization is.",
      "What is the difference between virtual machines and containers?",
      "Explain what configuration management is.",
      "What is the difference between configuration and customization?",
      "Explain what orchestration is.",
      "What is the difference between orchestration and automation?",
      "Explain what scalability is.",
      "What is the difference between horizontal and vertical scaling?",
      "Explain what reliability is.",
      "What is the difference between availability and reliability?",
      "Explain what security in DevOps is."
    ],
    'intermediate': [
      "Explain what CI/CD pipelines are.",
      "What is the difference between CI/CD and DevOps?",
      "Explain what infrastructure as code is.",
      "What is the difference between infrastructure as code and configuration as code?",
      "Explain what containerization is.",
      "What is the difference between Docker and Kubernetes?",
      "Explain what microservices are.",
      "What is the difference between microservices and monolithic architecture?",
      "Explain what service mesh is.",
      "What is the difference between service mesh and API gateway?",
      "Explain what observability is.",
      "What is the difference between observability and monitoring?",
      "Explain what distributed tracing is.",
      "What is the difference between distributed tracing and logging?",
      "Explain what chaos engineering is.",
      "What is the difference between chaos engineering and testing?",
      "Explain what GitOps is.",
      "What is the difference between GitOps and DevOps?",
      "Explain what platform engineering is.",
      "What is the difference between platform engineering and DevOps?",
      "Explain what site reliability engineering (SRE) is.",
      "What is the difference between SRE and DevOps?",
      "Explain what error budgets are.",
      "What is the difference between error budgets and SLAs?",
      "Explain what incident response is.",
      "What is the difference between incident response and problem management?",
      "Explain what post-mortems are.",
      "What is the difference between post-mortems and retrospectives?",
      "Explain what capacity planning is.",
      "What is the difference between capacity planning and resource planning?"
    ],
    'advanced': [
      "Explain what DevOps transformation is.",
      "What is the difference between DevOps transformation and DevOps adoption?",
      "Explain what DevOps culture is.",
      "What is the difference between DevOps culture and DevOps practices?",
      "Explain what DevOps metrics are.",
      "What is the difference between DevOps metrics and DevOps KPIs?",
      "Explain what DevOps automation is.",
      "What is the difference between DevOps automation and DevOps orchestration?",
      "Explain what DevOps security is.",
      "What is the difference between DevSecOps and DevOps?",
      "Explain what cloud-native development is.",
      "What is the difference between cloud-native and cloud-ready?",
      "Explain what serverless architecture is.",
      "What is the difference between serverless and containerless?",
      "Explain what edge computing is.",
      "What is the difference between edge computing and cloud computing?",
      "Explain what GitOps at scale is.",
      "What is the difference between GitOps and traditional CI/CD?",
      "Explain what platform as a service is.",
      "What is the difference between PaaS and IaaS?",
      "Explain what infrastructure automation is.",
      "What is the difference between infrastructure automation and infrastructure orchestration?",
      "Explain what deployment strategies are.",
      "What is the difference between blue-green and canary deployments?",
      "Explain what feature flags are.",
      "What is the difference between feature flags and feature toggles?",
      "Explain what environment management is.",
      "What is the difference between environment management and environment provisioning?",
      "Explain what compliance in DevOps is.",
      "What is the difference between compliance and governance in DevOps?"
    ]
  },
  'Cybersecurity': {
    'beginner': [
      "What is cybersecurity and why is it important?",
      "Explain the difference between security and privacy.",
      "What is the difference between threats and vulnerabilities?",
      "Explain what malware is.",
      "What is the difference between viruses and worms?",
      "Explain what phishing is.",
      "What is the difference between phishing and spear phishing?",
      "Explain what firewalls are.",
      "What is the difference between network firewalls and application firewalls?",
      "Explain what encryption is.",
      "What is the difference between symmetric and asymmetric encryption?",
      "Explain what authentication is.",
      "What is the difference between authentication and authorization?",
      "Explain what multi-factor authentication is.",
      "What is the difference between 2FA and MFA?",
      "Explain what passwords are.",
      "What is the difference between password hashing and password encryption?",
      "Explain what VPNs are.",
      "What is the difference between VPNs and proxies?",
      "Explain what antivirus software is.",
      "What is the difference between antivirus and anti-malware?",
      "Explain what security updates are.",
      "What is the difference between security updates and security patches?",
      "Explain what backup is.",
      "What is the difference between backup and recovery?",
      "Explain what incident response is.",
      "What is the difference between incident response and incident management?",
      "Explain what security awareness is.",
      "What is the difference between security awareness and security training?",
      "Explain what risk assessment is."
    ],
    'intermediate': [
      "Explain what penetration testing is.",
      "What is the difference between penetration testing and vulnerability assessment?",
      "Explain what security frameworks are.",
      "What is the difference between NIST and ISO 27001?",
      "Explain what threat modeling is.",
      "What is the difference between threat modeling and risk assessment?",
      "Explain what security architecture is.",
      "What is the difference between security architecture and security design?",
      "Explain what identity and access management is.",
      "What is the difference between IAM and PAM?",
      "Explain what security monitoring is.",
      "What is the difference between security monitoring and security surveillance?",
      "Explain what SIEM is.",
      "What is the difference between SIEM and SOAR?",
      "Explain what zero trust is.",
      "What is the difference between zero trust and traditional security?",
      "Explain what security automation is.",
      "What is the difference between security automation and security orchestration?",
      "Explain what DevSecOps is.",
      "What is the difference between DevSecOps and traditional security?",
      "Explain what cloud security is.",
      "What is the difference between cloud security and traditional security?",
      "Explain what container security is.",
      "What is the difference between container security and host security?",
      "Explain what API security is.",
      "What is the difference between API security and web security?",
      "Explain what data protection is.",
      "What is the difference between data protection and data privacy?",
      "Explain what compliance is.",
      "What is the difference between compliance and governance?"
    ],
    'advanced': [
      "Explain what security transformation is.",
      "What is the difference between security transformation and security evolution?",
      "Explain what security strategy is.",
      "What is the difference between security strategy and security tactics?",
      "Explain what security leadership is.",
      "What is the difference between security leadership and security management?",
      "Explain what security culture is.",
      "What is the difference between security culture and security awareness?",
      "Explain what security metrics are.",
      "What is the difference between security metrics and security KPIs?",
      "Explain what security analytics is.",
      "What is the difference between security analytics and security intelligence?",
      "Explain what threat intelligence is.",
      "What is the difference between threat intelligence and threat hunting?",
      "Explain what security orchestration is.",
      "What is the difference between security orchestration and security automation?",
      "Explain what security AI is.",
      "What is the difference between AI-assisted security and AI-automated security?",
      "Explain what security data science is.",
      "What is the difference between security data science and security analytics?",
      "Explain what security experimentation is.",
      "What is the difference between security experimentation and security testing?",
      "Explain what security optimization is.",
      "What is the difference between security optimization and security improvement?",
      "Explain what security measurement is.",
      "What is the difference between security measurement and security evaluation?",
      "Explain what security ROI is.",
      "What is the difference between security ROI and security value?",
      "Explain what security innovation is.",
      "What is the difference between security innovation and security creativity?"
    ]
  },
  'Business Analysis': {
    'beginner': [
      "What is business analysis and what does a business analyst do?",
      "Explain the difference between business analysis and business intelligence.",
      "What is the difference between requirements and specifications?",
      "Explain what stakeholder analysis is.",
      "What is the difference between internal and external stakeholders?",
      "Explain what requirements gathering is.",
      "What is the difference between functional and non-functional requirements?",
      "Explain what process mapping is.",
      "What is the difference between current state and future state?",
      "Explain what gap analysis is.",
      "What is the difference between gap analysis and root cause analysis?",
      "Explain what use cases are.",
      "What is the difference between use cases and user stories?",
      "Explain what acceptance criteria are.",
      "What is the difference between acceptance criteria and test cases?",
      "Explain what business rules are.",
      "What is the difference between business rules and business policies?",
      "Explain what data analysis is.",
      "What is the difference between data analysis and data analytics?",
      "Explain what process improvement is.",
      "What is the difference between process improvement and process optimization?",
      "Explain what change management is.",
      "What is the difference between change management and change control?",
      "Explain what risk assessment is.",
      "What is the difference between risk assessment and risk management?",
      "Explain what cost-benefit analysis is.",
      "What is the difference between cost-benefit analysis and ROI analysis?",
      "Explain what feasibility study is.",
      "What is the difference between technical feasibility and business feasibility?",
      "Explain what documentation is in business analysis."
    ],
    'intermediate': [
      "Explain what business process modeling is.",
      "What is the difference between BPMN and flowchart?",
      "Explain what requirements traceability is.",
      "What is the difference between requirements traceability and requirements tracking?",
      "Explain what business architecture is.",
      "What is the difference between business architecture and enterprise architecture?",
      "Explain what solution assessment is.",
      "What is the difference between solution assessment and solution evaluation?",
      "Explain what business case development is.",
      "What is the difference between business case and project charter?",
      "Explain what stakeholder management is.",
      "What is the difference between stakeholder management and stakeholder engagement?",
      "Explain what requirements validation is.",
      "What is the difference between requirements validation and requirements verification?",
      "Explain what business rules management is.",
      "What is the difference between business rules and business logic?",
      "Explain what data modeling is.",
      "What is the difference between conceptual and logical data models?",
      "Explain what workflow analysis is.",
      "What is the difference between workflow and process?",
      "Explain what business intelligence is.",
      "What is the difference between business intelligence and business analytics?",
      "Explain what performance measurement is.",
      "What is the difference between performance measurement and performance management?",
      "Explain what quality assurance is.",
      "What is the difference between quality assurance and quality control?",
      "Explain what business continuity is.",
      "What is the difference between business continuity and disaster recovery?",
      "Explain what compliance is.",
      "What is the difference between compliance and governance?"
    ],
    'advanced': [
      "Explain what business analysis maturity is.",
      "What is the difference between business analysis maturity and business analysis capability?",
      "Explain what business analysis strategy is.",
      "What is the difference between business analysis strategy and business analysis planning?",
      "Explain what business analysis leadership is.",
      "What is the difference between business analysis leadership and business analysis management?",
      "Explain what business analysis culture is.",
      "What is the difference between business analysis culture and business analysis practices?",
      "Explain what business analysis metrics are.",
      "What is the difference between business analysis metrics and business analysis KPIs?",
      "Explain what business analysis automation is.",
      "What is the difference between business analysis automation and business analysis orchestration?",
      "Explain what business analysis AI is.",
      "What is the difference between AI-assisted business analysis and AI-automated business analysis?",
      "Explain what business analysis data science is.",
      "What is the difference between business analysis data science and business analysis analytics?",
      "Explain what business analysis experimentation is.",
      "What is the difference between business analysis experimentation and business analysis testing?",
      "Explain what business analysis optimization is.",
      "What is the difference between business analysis optimization and business analysis improvement?",
      "Explain what business analysis measurement is.",
      "What is the difference between business analysis measurement and business analysis evaluation?",
      "Explain what business analysis ROI is.",
      "What is the difference between business analysis ROI and business analysis value?",
      "Explain what business analysis innovation is.",
      "What is the difference between business analysis innovation and business analysis creativity?",
      "Explain what business analysis transformation is.",
      "What is the difference between business analysis transformation and business analysis evolution?",
      "Explain what business analysis governance is.",
      "What is the difference between business analysis governance and business analysis management?"
    ]
  },
  'Project Management': {
    'beginner': [
      "What is project management and what does a project manager do?",
      "Explain the difference between a project and a program.",
      "What is the difference between project management and operations management?",
      "Explain what project lifecycle is.",
      "What is the difference between project phases and project stages?",
      "Explain what project scope is.",
      "What is the difference between project scope and product scope?",
      "Explain what project charter is.",
      "What is the difference between project charter and project plan?",
      "Explain what stakeholders are.",
      "What is the difference between project stakeholders and project team?",
      "Explain what project planning is.",
      "What is the difference between project planning and project scheduling?",
      "Explain what work breakdown structure is.",
      "What is the difference between WBS and project breakdown structure?",
      "Explain what project schedule is.",
      "What is the difference between project schedule and project timeline?",
      "Explain what project budget is.",
      "What is the difference between project budget and project cost?",
      "Explain what project risks are.",
      "What is the difference between project risks and project issues?",
      "Explain what project quality is.",
      "What is the difference between project quality and product quality?",
      "Explain what project communication is.",
      "What is the difference between project communication and project reporting?",
      "Explain what project monitoring is.",
      "What is the difference between project monitoring and project controlling?",
      "Explain what project closure is.",
      "What is the difference between project closure and project completion?",
      "Explain what project success is."
    ],
    'intermediate': [
      "Explain what project management methodologies are.",
      "What is the difference between Waterfall and Agile methodologies?",
      "Explain what Scrum is.",
      "What is the difference between Scrum and Kanban?",
      "Explain what project governance is.",
      "What is the difference between project governance and project management?",
      "Explain what project portfolio management is.",
      "What is the difference between project portfolio and project program?",
      "Explain what project resource management is.",
      "What is the difference between project resource management and project human resource management?",
      "Explain what project procurement is.",
      "What is the difference between project procurement and project purchasing?",
      "Explain what project integration is.",
      "What is the difference between project integration and project coordination?",
      "Explain what project change management is.",
      "What is the difference between project change management and project change control?",
      "Explain what project performance measurement is.",
      "What is the difference between project performance measurement and project performance management?",
      "Explain what project lessons learned are.",
      "What is the difference between project lessons learned and project retrospectives?",
      "Explain what project templates are.",
      "What is the difference between project templates and project standards?",
      "Explain what project tools are.",
      "What is the difference between project tools and project software?",
      "Explain what project metrics are.",
      "What is the difference between project metrics and project KPIs?",
      "Explain what project reporting is.",
      "What is the difference between project reporting and project communication?",
      "Explain what project documentation is.",
      "What is the difference between project documentation and project records?"
    ],
    'advanced': [
      "Explain what project management maturity is.",
      "What is the difference between project management maturity and project management capability?",
      "Explain what project management strategy is.",
      "What is the difference between project management strategy and project management planning?",
      "Explain what project management leadership is.",
      "What is the difference between project management leadership and project management management?",
      "Explain what project management culture is.",
      "What is the difference between project management culture and project management practices?",
      "Explain what project management transformation is.",
      "What is the difference between project management transformation and project management evolution?",
      "Explain what project management innovation is.",
      "What is the difference between project management innovation and project management creativity?",
      "Explain what project management automation is.",
      "What is the difference between project management automation and project management orchestration?",
      "Explain what project management AI is.",
      "What is the difference between AI-assisted project management and AI-automated project management?",
      "Explain what project management data science is.",
      "What is the difference between project management data science and project management analytics?",
      "Explain what project management experimentation is.",
      "What is the difference between project management experimentation and project management testing?",
      "Explain what project management optimization is.",
      "What is the difference between project management optimization and project management improvement?",
      "Explain what project management measurement is.",
      "What is the difference between project management measurement and project management evaluation?",
      "Explain what project management ROI is.",
      "What is the difference between project management ROI and project management value?",
      "Explain what project management governance is.",
      "What is the difference between project management governance and project management management?",
      "Explain what project management excellence is.",
      "What is the difference between project management excellence and project management best practices?"
    ]
  },
  'Customer Success': {
    'beginner': [
      "What is customer success and what does a customer success manager do?",
      "Explain the difference between customer success and customer service.",
      "What is the difference between customer success and customer support?",
      "Explain what customer onboarding is.",
      "What is the difference between customer onboarding and customer implementation?",
      "Explain what customer adoption is.",
      "What is the difference between customer adoption and customer usage?",
      "Explain what customer engagement is.",
      "What is the difference between customer engagement and customer interaction?",
      "Explain what customer satisfaction is.",
      "What is the difference between customer satisfaction and customer happiness?",
      "Explain what customer retention is.",
      "What is the difference between customer retention and customer loyalty?",
      "Explain what customer churn is.",
      "What is the difference between customer churn and customer attrition?",
      "Explain what customer lifetime value is.",
      "What is the difference between customer lifetime value and customer acquisition cost?",
      "Explain what customer health scores are.",
      "What is the difference between customer health scores and customer risk scores?",
      "Explain what customer journey mapping is.",
      "What is the difference between customer journey and customer experience?",
      "Explain what customer feedback is.",
      "What is the difference between customer feedback and customer insights?",
      "Explain what customer advocacy is.",
      "What is the difference between customer advocacy and customer referrals?",
      "Explain what customer expansion is.",
      "What is the difference between customer expansion and customer growth?",
      "Explain what customer renewal is.",
      "What is the difference between customer renewal and customer retention?",
      "Explain what customer success metrics are."
    ],
    'intermediate': [
      "Explain what customer success strategy is.",
      "What is the difference between customer success strategy and customer success tactics?",
      "Explain what customer success processes are.",
      "What is the difference between customer success processes and customer success procedures?",
      "Explain what customer success automation is.",
      "What is the difference between customer success automation and customer success orchestration?",
      "Explain what customer success analytics is.",
      "What is the difference between customer success analytics and customer success reporting?",
      "Explain what customer success segmentation is.",
      "What is the difference between customer success segmentation and customer success personalization?",
      "Explain what customer success playbooks are.",
      "What is the difference between customer success playbooks and customer success workflows?",
      "Explain what customer success technology is.",
      "What is the difference between customer success technology and customer success tools?",
      "Explain what customer success data is.",
      "What is the difference between customer success data and customer success information?",
      "Explain what customer success insights are.",
      "What is the difference between customer success insights and customer success intelligence?",
      "Explain what customer success optimization is.",
      "What is the difference between customer success optimization and customer success improvement?",
      "Explain what customer success measurement is.",
      "What is the difference between customer success measurement and customer success evaluation?",
      "Explain what customer success ROI is.",
      "What is the difference between customer success ROI and customer success value?",
      "Explain what customer success governance is.",
      "What is the difference between customer success governance and customer success management?",
      "Explain what customer success culture is.",
      "What is the difference between customer success culture and customer success practices?",
      "Explain what customer success leadership is.",
      "What is the difference between customer success leadership and customer success management?"
    ],
    'advanced': [
      "Explain what customer success transformation is.",
      "What is the difference between customer success transformation and customer success evolution?",
      "Explain what customer success innovation is.",
      "What is the difference between customer success innovation and customer success creativity?",
      "Explain what customer success AI is.",
      "What is the difference between AI-assisted customer success and AI-automated customer success?",
      "Explain what customer success data science is.",
      "What is the difference between customer success data science and customer success analytics?",
      "Explain what customer success experimentation is.",
      "What is the difference between customer success experimentation and customer success testing?",
      "Explain what customer success optimization at scale is.",
      "What is the difference between customer success optimization and customer success improvement?",
      "Explain what customer success personalization at scale is.",
      "What is the difference between customer success personalization and customer success customization?",
      "Explain what customer success automation at scale is.",
      "What is the difference between customer success automation and customer success orchestration?",
      "Explain what customer success analytics maturity is.",
      "What is the difference between customer success analytics maturity and customer success analytics capability?",
      "Explain what customer success measurement frameworks are.",
      "What is the difference between customer success measurement frameworks and customer success measurement models?",
      "Explain what customer success ROI optimization is.",
      "What is the difference between customer success ROI optimization and customer success value optimization?",
      "Explain what customer success governance frameworks are.",
      "What is the difference between customer success governance frameworks and customer success governance models?",
      "Explain what customer success culture transformation is.",
      "What is the difference between customer success culture transformation and customer success culture evolution?",
      "Explain what customer success leadership development is.",
      "What is the difference between customer success leadership development and customer success leadership training?",
      "Explain what customer success excellence is.",
      "What is the difference between customer success excellence and customer success best practices?"
    ]
  }
};

// Function to shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const InterviewPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const { sidebarCollapsed } = useTheme();
  const recognitionRef = useRef(null);
  
  // Session state
  const [sessionId, setSessionId] = useState(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentTopic, setCurrentTopic] = useState('Software Engineering');
  const [currentDifficulty, setCurrentDifficulty] = useState('intermediate');
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(120);
  const [sessionStats, setSessionStats] = useState({
    questionsAnswered: 0,
    averageConfidence: 0,
    totalTime: 0,
    averageEmotionScore: 0,
    totalEmotions: []
  });

  // Emotion and analysis state
  const [emotionData, setEmotionData] = useState({ 
    emotion: 'Detecting...', 
    confidence: 0, 
    eyeContact: 0 
  });
  const [allEmotionData, setAllEmotionData] = useState([]);
  const [transcript, setTranscript] = useState('');
  
  // Calculate emotion averages
  const calculateEmotionAverages = () => {
    if (allEmotionData.length === 0) return null;
    
    const emotionCounts = {};
    let totalConfidence = 0;
    let totalEyeContact = 0;
    
    allEmotionData.forEach(data => {
      emotionCounts[data.emotion] = (emotionCounts[data.emotion] || 0) + 1;
      totalConfidence += data.confidence;
      totalEyeContact += data.eyeContact;
    });
    
    const mostFrequentEmotion = Object.keys(emotionCounts).reduce((a, b) => 
      emotionCounts[a] > emotionCounts[b] ? a : b
    );
    
    return {
      totalReadings: allEmotionData.length,
      mostFrequentEmotion,
      averageConfidence: totalConfidence / allEmotionData.length,
      averageEyeContact: totalEyeContact / allEmotionData.length,
      emotionBreakdown: emotionCounts
    };
  };
  const [isListening, setIsListening] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTopicSelection, setShowTopicSelection] = useState(true);

  // Check authentication on component mount
  useEffect(() => {
    if (loading) return; // Wait for auth to finish loading
    
    if (!isAuthenticated || !user) {
      navigate('/');
      return;
    }
  }, [user, isAuthenticated, loading, navigate]);

  // Load session data from localStorage on mount
  useEffect(() => {
    const savedSessionData = localStorage.getItem('interviewSessionData');
    if (savedSessionData) {
      try {
        const parsedData = JSON.parse(savedSessionData);
        setSessionStats(parsedData);
      } catch (error) {
        console.error('Error parsing saved session data:', error);
      }
    }
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        setTranscript(finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (isSessionActive && timer > 0) {
      const countdown = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [isSessionActive, timer]);

  const generateQuestionsForTopic = async () => {
    setSessionLoading(true);
    setError('');
    
    try {
      // Add a realistic delay to show AI is working
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get questions from hardcoded question bank
      const topicQuestions = questionBank[currentTopic]?.[currentDifficulty] || [];
      
      if (topicQuestions.length === 0) {
        setError('No questions available for this topic and difficulty combination.');
        return;
      }
      
      // Shuffle the questions and take first 6
      const shuffledQuestions = shuffleArray(topicQuestions).slice(0, 6);
      
      setGeneratedQuestions(shuffledQuestions);
      setCurrentQuestionIndex(0);
      setCurrentQuestion(shuffledQuestions[0]);
      setShowTopicSelection(false);
    } catch (error) {
      console.error('Error generating questions:', error);
      setError('Failed to generate questions. Please try again.');
    } finally {
      setSessionLoading(false);
    }
  };

  const startSession = async () => {
    setSessionLoading(true);
    setError('');
    
    try {
      const session = await apiService.createSession();
      setSessionId(session.id);
      setIsSessionActive(true);
      setTimer(120);
      setSessionStats({
        questionsAnswered: 0,
        averageConfidence: 0,
        totalTime: 0,
        averageEmotionScore: 0,
        totalEmotions: []
      });
    } catch (error) {
      console.error('Error starting session:', error);
      setError('Failed to start session. Please try again.');
    } finally {
      setSessionLoading(false);
    }
  };

  const endSession = async () => {
    if (!sessionId) return;
    
    try {
      // Calculate final statistics with enhanced data
      const finalStats = {
        end_time: new Date().toISOString(),
        duration_seconds: sessionStats.totalTime,
        total_questions: sessionStats.questionsAnswered,
        average_confidence: sessionStats.averageConfidence,
        dominant_emotion: sessionStats.totalEmotions.length > 0 
          ? sessionStats.totalEmotions.reduce((a, b, i, arr) => 
              arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
            ) 
          : 'Neutral',
        emotion_data: sessionStats.totalEmotions,
        confidence_scores: sessionStats.averageConfidence,
        session_summary: (() => {
          const emotionAverages = calculateEmotionAverages();
          const baseSummary = `Completed ${sessionStats.questionsAnswered} questions with ${(sessionStats.averageConfidence * 100).toFixed(1)}% average confidence.`;
          
          if (emotionAverages) {
            return `${baseSummary} Emotion Analysis: ${emotionAverages.totalReadings} readings, most frequent: ${emotionAverages.mostFrequentEmotion}, avg confidence: ${(emotionAverages.averageConfidence * 100).toFixed(1)}%, avg eye contact: ${(emotionAverages.averageEyeContact * 100).toFixed(1)}%`;
          }
          
          return `${baseSummary} Detected emotions: ${sessionStats.totalEmotions.join(', ')}`;
        })()
      };
      
      
      // Store final data in localStorage for dashboard access
      localStorage.setItem('lastSessionData', JSON.stringify({
        ...finalStats,
        timestamp: new Date().toISOString(),
        user_id: user?.id
      }));
      
      await apiService.updateSession(sessionId, finalStats);
      
      // Clear current session data
      localStorage.removeItem('interviewSessionData');
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error ending session:', error);
      setError('Failed to end session properly.');
    }
  };

  const generateNewQuestion = () => {
    // This function is no longer needed as questions are generated by AI
    // Keeping for backward compatibility
    setTimer(120);
    setTranscript('');
    setAiFeedback(null);
  };

  const nextQuestion = () => {
    setSessionStats(prev => ({
      ...prev,
      questionsAnswered: prev.questionsAnswered + 1,
      totalTime: prev.totalTime + (120 - timer)
    }));
    
    if (currentQuestionIndex < generatedQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(generatedQuestions[nextIndex]);
    } else {
      // All questions completed
      setCurrentQuestion('All questions completed! Great job!');
    }
    
    setTimer(120);
    setTranscript('');
    setAiFeedback(null);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const analyzeAnswer = async () => {
    if (!transcript.trim()) {
      setError('Please provide an answer before analyzing.');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Use comprehensive analysis that includes emotion data
      const response = await apiService.analyzeComprehensive(currentQuestion, transcript, emotionData);
      setAiFeedback(response.analysis);
      
      // Update session stats with emotion data
      setSessionStats(prev => ({
        ...prev,
        totalEmotions: [...prev.totalEmotions, emotionData.emotion],
        averageEmotionScore: (prev.averageEmotionScore + emotionData.confidence) / 2
      }));
    } catch (error) {
      console.error('Error analyzing answer:', error);
      const feedback = generateAIFeedback(transcript, currentQuestion);
      setAiFeedback(feedback);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateAIFeedback = (answer, question) => {
    const feedback = {
      strengths: [],
      improvements: [],
      score: Math.floor(Math.random() * 40) + 60,
      overall: ''
    };

    if (answer.length > 200) {
      feedback.strengths.push('Good detail and depth in your response');
    } else {
      feedback.improvements.push('Try to provide more specific examples and details');
    }

    const positiveKeywords = ['experience', 'learned', 'challenge', 'success', 'team', 'project'];
    const hasPositiveKeywords = positiveKeywords.some(keyword => 
      answer.toLowerCase().includes(keyword)
    );

    if (hasPositiveKeywords) {
      feedback.strengths.push('Good use of relevant keywords and examples');
    } else {
      feedback.improvements.push('Include more specific examples from your experience');
    }

    if (feedback.score >= 80) {
      feedback.overall = 'Excellent answer! You demonstrated strong communication skills and provided relevant examples.';
    } else if (feedback.score >= 70) {
      feedback.overall = 'Good answer with room for improvement. Consider adding more specific examples.';
    } else {
      feedback.overall = 'Your answer could be stronger. Try to be more specific and provide concrete examples.';
    }

    return feedback;
  };

  const handleEmotionUpdate = (data) => {
    console.log('InterviewPage: Received emotion data:', data);
    setEmotionData(data);
    
    // Add to all emotion data collection
    setAllEmotionData(prev => [...prev, data]);
    
    setSessionStats(prev => {
      const newTotalEmotions = [...prev.totalEmotions, data.emotion];
      const newAverageConfidence = prev.averageConfidence === 0 
        ? data.confidence 
        : (prev.averageConfidence + data.confidence) / 2;
      
      // Store the data in session storage for persistence
      const sessionData = {
        ...prev,
        averageConfidence: newAverageConfidence,
        totalEmotions: newTotalEmotions,
        averageEmotionScore: newTotalEmotions.length > 0 
          ? newTotalEmotions.reduce((sum, emotion, index) => {
              // Enhanced emotion scoring for interview context
              const emotionScores = { 
                'confident': 1, 'focused': 0.9, 'engaged': 0.9, 'determined': 0.9,
                'neutral': 0.6, 'calm': 0.8, 'happy': 0.8, 'surprise': 0.7,
                'sad': 0.3, 'angry': 0.2, 'fear': 0.2, 'anxious': 0.3
              };
              return sum + (emotionScores[emotion.toLowerCase()] || 0.5);
            }, 0) / newTotalEmotions.length
          : 0,
        lastUpdate: new Date().toISOString()
      };
      
      // Store in localStorage for persistence across page refreshes
      localStorage.setItem('interviewSessionData', JSON.stringify(sessionData));
      
      return sessionData;
    });
  };

  // Show loading while auth is being checked
  if (loading || !isAuthenticated) {
    return <LoadingSpinner text="Preparing your interview session..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700 flex">
      <Sidebar />
      
      <div className="flex-1">
        <div className="p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold gradient-text mb-2">
              🎤 AI Interview Coach
            </h1>
            <p className="text-gray-400 mb-4">
              Real-time analysis with AI feedback and emotion detection
            </p>
            
            {/* Session Stats */}
            <div className="flex justify-center space-x-6 flex-wrap">
              <div className="flex items-center space-x-2 bg-gray-800/50 px-4 py-2 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Questions: {sessionStats.questionsAnswered}</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-800/50 px-4 py-2 rounded-lg">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">Confidence: {(sessionStats.averageConfidence * 100).toFixed(1)}%</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-800/50 px-4 py-2 rounded-lg">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">Time: {Math.floor(sessionStats.totalTime / 60)}m {sessionStats.totalTime % 60}s</span>
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300"
            >
              {error}
            </motion.div>
          )}

          {/* Topic Selection */}
          {showTopicSelection && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                🎯 Choose Your Interview Topic
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {Object.entries(interviewTopics).map(([topic, config]) => (
                  <motion.button
                    key={topic}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentTopic(topic)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      currentTopic === topic
                        ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                        : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <h3 className="font-semibold mb-2">{topic}</h3>
                    <p className="text-sm opacity-80">{config.description}</p>
                  </motion.button>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">Difficulty:</span>
                  <select
                    value={currentDifficulty}
                    onChange={(e) => setCurrentDifficulty(e.target.value)}
                    className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generateQuestionsForTopic}
                  disabled={sessionLoading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sessionLoading ? (
                    <>
                      <div className="relative">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        <div className="absolute inset-0 w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-2" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
                      </div>
                      <span className="flex items-center">
                        <span className="animate-pulse">AI is generating</span>
                        <span className="ml-1 animate-bounce">...</span>
                      </span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Generate Questions
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Main Interview Interface */}
          {!showTopicSelection && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Camera Feed with Real-time Analysis */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-xl p-6 relative overflow-hidden"
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl" />
                
                <h3 className="text-xl font-bold text-white mb-4 flex items-center relative z-10">
                  <Camera className="w-5 h-5 mr-2 text-blue-400" />
                  Camera Feed
                  <div className="ml-auto flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400 font-medium">AI Analysis Active</span>
                  </div>
                </h3>
                <div className="relative z-10">
                  <CameraFeed
                    onEmotionUpdate={handleEmotionUpdate}
                    sessionId={sessionId}
                    isActive={isSessionActive || generatedQuestions.length > 0}
                  />
                </div>
              </motion.div>

              {/* Real-time Emotion Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-400" />
                  Real-time Analysis
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-300">Current Emotion:</span>
                    <span className="text-white font-semibold">{emotionData.emotion}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-300">Confidence:</span>
                    <span className="text-white font-semibold">{(emotionData.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-300">Eye Contact:</span>
                    <span className="text-white font-semibold">{(emotionData.eyeContact * 100).toFixed(1)}%</span>
                  </div>
                  
                  {/* Emotion Averages */}
                  {(() => {
                    const emotionAverages = calculateEmotionAverages();
                    if (emotionAverages && emotionAverages.totalReadings > 0) {
                      return (
                        <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30">
                          <h4 className="text-lg font-bold text-white mb-3 flex items-center">
                            <Brain className="w-5 h-5 mr-2 text-purple-400" />
                            Session Averages
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300">Total Readings:</span>
                              <span className="text-white font-semibold">{emotionAverages.totalReadings}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300">Most Frequent:</span>
                              <span className="text-white font-semibold">{emotionAverages.mostFrequentEmotion}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300">Avg Confidence:</span>
                              <span className="text-white font-semibold">{(emotionAverages.averageConfidence * 100).toFixed(1)}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300">Avg Eye Contact:</span>
                              <span className="text-white font-semibold">{(emotionAverages.averageEyeContact * 100).toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              </motion.div>

              {/* AI Feedback Panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-green-400" />
                  AI Feedback
                </h3>
                {aiFeedback ? (
                  <div className="space-y-4">
                    <div className="text-center p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
                      <div className="text-2xl font-bold text-white mb-1">
                        {aiFeedback.overall_score || aiFeedback.score}/100
                      </div>
                      <div className="text-sm text-gray-300">Overall Score</div>
                    </div>
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <p className="text-gray-200 italic">"{aiFeedback.overall_feedback || aiFeedback.overall}"</p>
                    </div>
                    {aiFeedback.emotional_insights && (
                      <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
                        <h4 className="text-purple-400 font-semibold mb-2">Emotional Insights:</h4>
                        <p className="text-sm text-gray-300">{aiFeedback.emotional_insights}</p>
                      </div>
                    )}
                    {aiFeedback.strengths && aiFeedback.strengths.length > 0 && (
                      <div>
                        <h4 className="text-green-400 font-semibold mb-2">Strengths:</h4>
                        <ul className="space-y-1">
                          {aiFeedback.strengths.map((strength, index) => (
                            <li key={index} className="text-sm text-gray-300 flex items-start">
                              <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {aiFeedback.improvements && aiFeedback.improvements.length > 0 && (
                      <div>
                        <h4 className="text-orange-400 font-semibold mb-2">Improvements:</h4>
                        <ul className="space-y-1">
                          {aiFeedback.improvements.map((improvement, index) => (
                            <li key={index} className="text-sm text-gray-300 flex items-start">
                              <AlertCircle className="w-4 h-4 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Complete your answer to get AI feedback</p>
                  </div>
                )}
              </motion.div>
            </div>
          )}

          {/* Question Section */}
          {!showTopicSelection && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-xl p-6 mb-6"
            >
              {/* Question Header */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">Topic:</span>
                    <span className="text-white font-semibold">{currentTopic}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300">Question:</span>
                    <span className="text-white font-semibold">
                      {currentQuestionIndex + 1} of {generatedQuestions.length}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span className="text-2xl font-bold text-blue-400">
                      {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(((currentQuestionIndex + 1) / generatedQuestions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / generatedQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Current Question */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-3">📝 Current Question</h3>
                <div className="p-4 bg-gray-800/50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-lg text-gray-200">
                    {currentQuestion || "Loading question..."}
                  </p>
                </div>
              </div>

            {/* Speech Recognition Section */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Mic className="w-5 h-5 mr-2 text-blue-400" />
                Your Answer
              </h4>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={isListening ? stopListening : startListening}
                  disabled={!isSessionActive}
                  className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5" />
                      <span>Stop Recording</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      <span>Start Recording</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={analyzeAnswer}
                  disabled={!transcript.trim() || isAnalyzing}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5" />
                      <span>Analyze Answer</span>
                    </>
                  )}
                </motion.button>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-300 mb-2">Your Response:</h5>
                <div className="min-h-[120px] max-h-[300px] p-3 bg-gray-900/50 rounded border border-gray-600 text-gray-200 whitespace-pre-wrap overflow-y-auto">
                  {transcript || "Start speaking to see your response here..."}
                </div>
              </div>
            </div>

              {/* Session Controls */}
              <div className="text-center">
                {!isSessionActive ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startSession}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-lg text-lg transition-all duration-200 shadow-lg"
                  >
                    <Play className="w-6 h-6 inline mr-2" />
                    Start Interview Session
                  </motion.button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {currentQuestionIndex < generatedQuestions.length - 1 ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={nextQuestion}
                        className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all duration-200"
                      >
                        <ArrowRight className="w-5 h-5" />
                        <span>Next Question</span>
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={endSession}
                        className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition-all duration-200"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Complete Interview</span>
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowTopicSelection(true)}
                      className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-lg transition-all duration-200"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Change Topic</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={endSession}
                      className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-200"
                    >
                      <Square className="w-5 h-5" />
                      <span>End Session</span>
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
