# TestNet Wallet - Replit Documentation

## Overview

TestNet Wallet is a full-stack web application built for interacting with blockchain testnets. It provides a secure, user-friendly interface for managing cryptocurrency wallets, tokens, and transactions across multiple testnet environments. The application emphasizes testnet-only functionality to ensure safe development and testing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state, React Context for local state
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for development and building

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **API Design**: RESTful API with typed endpoints
- **Authentication**: Privy for user authentication and wallet management
- **Development Server**: Custom Vite integration for hot module replacement

## Key Components

### Authentication System
- **Provider**: Privy authentication service
- **Features**: Email and wallet-based login, embedded wallet creation
- **Security**: Encrypted private key storage, user-specific wallet generation

### Database Schema
- **Users**: Stores user profiles with Privy IDs and wallet information
- **Networks**: Blockchain network configurations (testnets only)
- **Tokens**: Token definitions per network with metadata
- **Transactions**: Transaction history and status tracking
- **Wallet Tokens**: User-specific token balances
- **Faucets**: Testnet faucet URLs for token acquisition

### Web3 Integration
- **Library**: ethers.js for blockchain interactions
- **Features**: Balance queries, transaction sending, token interactions
- **Networks**: Multi-testnet support (Sepolia, Mumbai, BSC Testnet, Avalanche Fuji)

### Storage Layer
- **Development**: In-memory storage for rapid prototyping
- **Production**: PostgreSQL with Drizzle ORM
- **Migrations**: Database schema versioning with Drizzle Kit

## Data Flow

### User Onboarding
1. User authenticates through Privy
2. System checks for existing wallet
3. If new user, generates wallet and encrypts private key
4. Stores user data and wallet information

### Wallet Operations
1. User selects target network
2. Application fetches network configuration
3. Web3 service establishes RPC connection
4. User performs operations (view balance, send tokens, etc.)
5. Transactions are broadcast and tracked

### Token Management
1. System loads available tokens per network
2. User balances are fetched from blockchain
3. Token metadata is displayed with current prices
4. Balance updates are cached and refreshed on demand

## External Dependencies

### Authentication
- **Privy**: Handles user authentication and embedded wallet management
- **Configuration**: Supports email and wallet login methods

### Blockchain Connectivity
- **RPC Providers**: Network-specific RPC endpoints for testnet access
- **Faucets**: External testnet faucets for token acquisition

### UI Components
- **Radix UI**: Headless UI primitives for accessibility
- **Lucide Icons**: Icon library for consistent visual elements
- **Tailwind CSS**: Utility-first CSS framework

### Development Tools
- **Vite**: Build tool with custom plugin integration
- **Replit**: Development environment with live preview
- **TypeScript**: Type safety across the entire stack

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with HMR
- **Database**: In-memory storage for rapid iteration
- **Authentication**: Privy development environment

### Production Deployment
- **Frontend**: Static assets served by Express
- **Backend**: Express server with production database
- **Database**: PostgreSQL with connection pooling
- **Environment**: Production Privy configuration

### Build Process
1. Frontend assets built with Vite
2. Backend TypeScript compiled with esbuild
3. Database migrations applied with Drizzle Kit
4. Single Node.js process serves both frontend and API

### Security Considerations
- **Testnet Only**: All operations restricted to test networks
- **Private Key Encryption**: User private keys encrypted at rest
- **Environment Variables**: Sensitive configuration externalized
- **CORS**: Proper cross-origin resource sharing configuration

The architecture prioritizes developer experience while maintaining security best practices. The testnet-only focus ensures safe experimentation without risking real funds.