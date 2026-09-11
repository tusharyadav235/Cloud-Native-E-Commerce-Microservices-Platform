# Cloud-Native E-Commerce Microservices Platform

![Architecture: Microservices](https://img.shields.io/badge/Architecture-Microservices-blue)
![Backend: Spring Boot](https://img.shields.io/badge/Backend-Java%20%7C%20Spring%20Boot-green)
![Frontend: React](https://img.shields.io/badge/Frontend-React%20%7C%20Node.js-blue)
![DevOps: Kubernetes & Docker](https://img.shields.io/badge/DevOps-Kubernetes%20%7C%20Docker%20%7C%20ArgoCD-informational)
![CI/CD: Jenkins & GitOps](https://img.shields.io/badge/CI%2FCD-Jenkins%20%7C%20GitOps-orange)

An enterprise-grade, highly scalable e-commerce platform built using a microservices architecture. This project demonstrates modern cloud-native development, containerization, and a fully automated GitOps-driven deployment strategy.

## 🏗️ Architecture

The platform is divided into domain-specific backend microservices and a modern frontend interface:

- **Cart Service (`/cart-service`)**: Manages shopping cart state and checkout sessions.
- **Order Service (`/order-service`)**: Handles order processing, inventory reservations, and payment states.
- **Product Service (`/product-service`)**: Manages the product catalog, pricing, and availability.
- **Frontend (`/frontend`)**: A reactive user interface serving customers.

### Infrastructure & Core DevOps

This project heavily utilizes DevOps best practices to ensure high availability, security, and developer velocity.

- **Containerization**: All services use multi-stage, production-ready Docker builds. Containers run as non-root users (`nginx-unprivileged` for frontend, `appuser` for Java) to minimize attack surfaces.
- **Kubernetes Orchestration (`/k8s`)**: 
  - Managed via **Kustomize** with `base` and overlay (`dev`/`prod`) environments.
  - Implements **Zero-Downtime Deployments** using `RollingUpdate` strategies (`maxUnavailable: 0`).
  - Highly Available scheduling using **Pod Anti-Affinity** rules.
  - Robust **Health Probes** (Startup, Readiness, Liveness) using Spring Boot Actuator.
  - Dynamic configuration injection via `envFrom` Secrets and ConfigMaps.

## 🔄 CI/CD Pipeline (Jenkins)

The project uses Jenkins for Continuous Integration. The pipeline (`Jenkinsfile`) strictly follows DevSecOps principles:

1. **Build & Test**: Compiles the source code and runs JUnit automated tests.
2. **Security Analysis**: 
   - Static Application Security Testing (SAST) via **SonarQube**.
   - Software Composition Analysis (SCA) via **OWASP Dependency Check**.
3. **Docker Build, Scan, & Push**:
   - Builds the Docker image.
   - Scans the container image for vulnerabilities using **Trivy** (failing the build on HIGH/CRITICAL vulnerabilities).
   - Pushes the verified image to Amazon ECR.
4. **GitOps Promotion**: Automatically runs `kustomize edit set image` to update the image tag in the Kubernetes manifests, commits the changes, and pushes them back to the repository to trigger a deployment.

## 🛳️ GitOps Deployment Strategy (ArgoCD)

The deployment process follows a strict **GitOps** methodology managed by **ArgoCD** (`/k8s/argocd-app.yaml`).

- **Declarative Infrastructure**: The Git repository acts as the single source of truth for the cluster state.
- **Automated Sync**: ArgoCD continuously monitors the `k8s/overlays/dev` and `k8s/overlays/prod` directories. When the Jenkins pipeline commits a new image tag, ArgoCD automatically detects the drift and syncs the changes to the Kubernetes cluster.
- **Self-Healing**: If any manual, unauthorized changes are made directly to the cluster (e.g., via `kubectl`), ArgoCD automatically prunes and self-heals the resources back to the state defined in Git.

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Kubernetes Cluster (Minikube, kind, or cloud-managed)
- `kubectl` and `kustomize` CLI tools

### Local Development (Docker)
Build and run the services locally using Docker:
```bash
docker-compose up -d --build
```

### Kubernetes Deployment (Manual Fallback)
Deploy the application to your Kubernetes cluster manually using Kustomize (if not using ArgoCD):

**For Development:**
```bash
kubectl apply -k k8s/overlays/dev
```

**For Production:**
```bash
kubectl apply -k k8s/overlays/prod
```

## 🔒 Security Posture
- Container processes run as unprivileged, non-root users.
- Kubernetes Pods enforce `RuntimeDefault` seccomp profiles.
- Container capabilities are explicitly dropped (`drop: ALL`).
- Secrets and ConfigMaps are dynamically injected and managed via Kustomize overlays.
- CI/CD pipeline enforces Trivy container scanning and OWASP dependency checks.
