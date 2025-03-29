# Building and Deploying an Arbitrum-Decaf Rollup for BrewBridge

This guide provides step-by-step instructions for building and deploying an Arbitrum-Decaf Rollup for BrewBridge, a cross-chain liquidity pool platform that leverages Espresso confirmations for secure bridging and AI for optimizing liquidity routing across networks.

## Overview

BrewBridge requires a fast, secure blockchain infrastructure that can facilitate cross-chain transactions with near-instant finality. An Arbitrum-Decaf rollup (Arbitrum Nitro with Espresso integration) provides:

- **Fast finality**: Espresso's HotShot consensus provides confirmations in 2-3 seconds
- **Strong security guarantees**: Byzantine Fault Tolerance (BFT) consensus from Espresso plus Ethereum's underlying security
- **Cross-chain capabilities**: Efficient messaging between chains with fast confirmation
- **Custom environment**: A dedicated chain optimized specifically for BrewBridge's liquidity operations

## Prerequisites

- AWS account with permissions to create EC2 instances
- Basic familiarity with Docker, Docker Compose, and cloud infrastructure
- Node.js (v16+), Yarn, Git, and Foundry installed locally
- Ethereum wallet with Sepolia ETH for contract deployment
- Access to Ethereum Sepolia RPC endpoints (WebSocket required)

## Deployment Checklist

- [ ] 1. Set up AWS EC2 infrastructure
- [ ] 2. Clone and configure repositories
- [ ] 3. Deploy rollup contracts on Arbitrum Sepolia
- [ ] 4. Configure Nitro and Validation nodes
- [ ] 5. Configure Espresso Caffeinated node
- [ ] 6. Launch Nitro node and Validation node
- [ ] 7. Launch Caffeinated node for Espresso integration
- [ ] 8. Verify rollup operation and Espresso confirmations
- [ ] 9. Test cross-chain transaction flow
- [ ] 10. Set up monitoring tools
- [ ] 11. Document RPC endpoints and configuration for BrewBridge development

## Step 1: Set Up AWS EC2 Infrastructure

### 1.1 Launch an EC2 Instance

1. Log in to the AWS Management Console and navigate to EC2
2. Click "Launch Instance" and select an Ubuntu 20.04 LTS or Amazon Linux 2 AMI
3. Choose an instance type with sufficient resources:
   - At least 2 vCPUs
   - Minimum 8GB RAM (t3.large or better recommended)
   - At least 30GB of storage

4. Configure security group to allow the following inbound ports:
   - SSH (22)
   - Rollup RPC HTTP (8547)
   - Rollup RPC WebSocket (8549)
   - Validation node (8949)
   - Caffeinated node (8550)

5. Launch the instance with a key pair for SSH access

### 1.2 Set Up the EC2 Environment

Connect to your instance and install dependencies:

```bash
# Update package lists
sudo yum update -y   # Amazon Linux
# or
sudo apt update      # Ubuntu

# Install Docker
sudo yum install -y docker   # Amazon Linux
# or
sudo apt install -y docker.io   # Ubuntu

# Start Docker service
sudo service docker start
sudo usermod -aG docker ec2-user   # Amazon Linux
# or
sudo usermod -aG docker ubuntu     # Ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js, NPM, Git
sudo yum install -y nodejs npm git   # Amazon Linux
# or
sudo apt install -y nodejs npm git   # Ubuntu

# Install Yarn
npm install -g yarn

# Verify installations
docker --version
docker-compose --version
node --version
yarn --version
git --version
```

Log out and log back in to apply the Docker group membership.

## Step 2: Clone and Configure Repositories

### 2.1 Clone Required Repositories

```bash
# Create a project directory
mkdir -p ~/brewbridge
cd ~/brewbridge

# Clone Arbitrum Nitro contracts with Espresso integration
git clone https://github.com/EspressoSystems/nitro-contracts.git
cd nitro-contracts
git checkout develop

# Install dependencies and build
yarn install
yarn build:all

# Return to project directory
cd ~/brewbridge

# Clone the quickstart configuration
git clone https://github.com/EspressoSystems/espresso-build-something-real.git

# Clone the hackathon example for monitoring (optional)
git clone https://github.com/EspressoSystems/hackathon-example.git --recursive
```

### 2.2 Create Configuration Directory Structure

```bash
mkdir -p ~/brewbridge/rollup/config
mkdir -p ~/brewbridge/rollup/database
mkdir -p ~/brewbridge/rollup/wasm
mkdir -p ~/brewbridge/rollup/caff-node/config
mkdir -p ~/brewbridge/rollup/caff-node/database
```

## Step 3: Deploy Rollup Contracts on Arbitrum Sepolia

### 3.1 Set Up Environment Variables

Navigate to the nitro-contracts directory and set up the environment:

```bash
cd ~/brewbridge/nitro-contracts
```

Create a `.env` file with the following content:

```
ARBISCAN_API_KEY="YOUR_ETHERSCAN_API_KEY"
DEVNET_PRIVKEY="YOUR_PRIVATE_KEY"
ESPRESSO_TEE_VERIFIER_ADDRESS="0x8354db765810dF8F24f1477B06e91E5b17a408bF"
```

Replace:
- `YOUR_ETHERSCAN_API_KEY` with your Etherscan API key
- `YOUR_PRIVATE_KEY` with your Ethereum private key (without the 0x prefix)
- Verify the TEE Verifier address for Decaf testnet from Espresso docs

### 3.2 Configure Rollup Deployment Parameters

Create a `config.ts` file based on the example:

```bash
cp scripts/config.ts.example scripts/config.ts
```

Edit `scripts/config.ts` to set up your rollup parameters:

```typescript
// Customize these parameters for BrewBridge
module.exports = {
  // Chain configuration
  chainName: "BrewBridge",
  chainId: 49431,  // Choose a unique chain ID

  // Token configuration
  nativeToken: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18
  },

  // L1 network connection (use Sepolia)
  l1Network: "sepolia",

  // Rollup Creator address provided by Espresso for Decaf testnet
  rollupCreatorAddress: "0xd5915f1735e0d3b0d1ccd77cb99c87fb421cc03d",

  // Batch poster configuration with Espresso
  batchPoster: {
    address: "ADDRESS_FROM_YOUR_WALLET",  // Your deployer address
    // Espresso configs for the batch poster
    teeOffArbOs: "NEWEST_ESPRESSO_VERSION"
  },

  // Validators (can use the same address as batch poster for testing)
  validators: ["ADDRESS_FROM_YOUR_WALLET"],

  // For testing, disable fees
  disableFees: true
};
```

### 3.3 Deploy the Rollup Contracts

Run the deployment script to create your rollup on Sepolia:

```bash
npx hardhat run scripts/createEthRollup.ts --network sepolia
```

This will deploy your rollup contracts and output:
- The addresses of core contracts (Bridge, Inbox, SequencerInbox, Rollup)
- The RPC URL for your rollup
- The block number when the rollup was deployed

Save this information as it will be needed for configuration.

## Step 4: Configure Nitro and Validation Nodes

### 4.1 Create the L2 Chain Info Configuration

In your `~/brewbridge/rollup/config` directory, create an `l2_chain_info.json` file:

```json
{
  "chain-name": "BrewBridge",
  "chain-id": 49431,
  "parent-chain-id": 421614,
  "parent-chain-is-arbitrum": false,
  "chain-config": {
    "chainId": 49431,
    "homesteadBlock": 0,
    "daoForkBlock": null,
    "daoForkSupport": true,
    "eip150Block": 0,
    "eip150Hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "eip155Block": 0,
    "eip158Block": 0,
    "byzantiumBlock": 0,
    "constantinopleBlock": 0,
    "petersburgBlock": 0,
    "istanbulBlock": 0,
    "muirGlacierBlock": 0,
    "berlinBlock": 0,
    "londonBlock": 0,
    "clique": {
      "period": 0,
      "epoch": 0
    },
    "arbitrum": {
      "EnableArbOS": true,
      "AllowDebugPrecompiles": false,
      "DataAvailabilityCommittee": true,
      "InitialArbOSVersion": 11,
      "InitialChainOwner": "YOUR_DEPLOYER_ADDRESS",
      "GenesisBlockNum": 0
    }
  },
  "rollup": {
    "bridge": "BRIDGE_ADDRESS",
    "inbox": "INBOX_ADDRESS",
    "sequencer-inbox": "SEQUENCER_INBOX_ADDRESS",
    "rollup": "ROLLUP_ADDRESS",
    "validator-utils": "VALIDATOR_UTILS_ADDRESS",
    "validator-wallet-creator": "VALIDATOR_WALLET_CREATOR_ADDRESS",
    "deployed-at": DEPLOYED_BLOCK_NUMBER
  },
  "l1-connections": {
    "parent-chain-node-url": "WSS_URL_TO_SEPOLIA"
  },
  "native-token": "0x0000000000000000000000000000000000000000"
}
```

Replace the placeholder values with the actual addresses from your deployment.

### 4.2 Configure the Full Node

Create a `full_node.json` configuration in `~/brewbridge/rollup/config`:

```json
{
  "feed": {
    "input": {
      "url": "",
      "auth": {
        "jwt-secret": "/config/val_jwt.hex"
      }
    },
    "output": {
      "addr": "0.0.0.0:9642",
      "jwt": {
        "secret": "/config/val_jwt.hex"
      }
    }
  },
  "http": {
    "addr": "0.0.0.0:8547",
    "vhosts": "*",
    "corsdomain": "*",
    "api": [
      "eth",
      "net",
      "web3",
      "arb",
      "debug"
    ]
  },
  "log": {
    "context-indent": 0,
    "format": "text"
  },
  "metrics": {
    "enabled": true,
    "addr": "0.0.0.0:6070",
    "path": "/metrics"
  },
  "node": {
    "chain": {
      "info-file": "/config/l2_chain_info.json",
      "id": 49431
    },
    "data-dir": "/home/user/.arbitrum",
    "forwarding-target": ""
  },
  "parent-chain": {
    "connection": {
      "url": "YOUR_SEPOLIA_RPC_URL"
    }
  },
  "sequencer": {
    "enable": true,
    "client": false,
    "max-tx-data-size": 1048576,
    "dangerous": {
      "non-batch-poster": true,
      "enable-arbitrum-dao": false,
      "no-parent-chain-server": true
    }
  },
  "validator": {
    "enable": false,
    "staker-delegate": {
      "address": "0x0000000000000000000000000000000000000000",
      "strategy-config": {
        "wait-for-confirmation": true,
        "disable-batch-posting": false,
        "time-limit-per-step": "0s",
        "l1-block-number": 0
      }
    },
    "batch-poster": {
      "enable": false,
      "parent-chain-wallet": {
        "private-key": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "password": ""
      }
    },
    "utils": {
      "address": "VALIDATOR_UTILS_ADDRESS"
    },
    "jwtsecret": "/config/val_jwt.hex"
  },
  "ws": {
    "addr": "0.0.0.0:8548",
    "api": [
      "net",
      "web3",
      "eth",
      "arb"
    ],
    "origins": [
      "*"
    ]
  }
}
```

### 4.3 Configure the Validation Node

Create a `validation_node_config.json` configuration in `~/brewbridge/rollup/config`:

```json
{
  "feed": {
    "input": {
      "url": "ws://nitro-node:9642",
      "auth": {
        "jwt-secret": "/config/val_jwt.hex"
      }
    }
  },
  "http": {
    "addr": "0.0.0.0:8549",
    "api": ["eth", "arb", "net", "web3", "debug"]
  },
  "log": {
    "context-indent": 0,
    "format": "text"
  },
  "metrics": {
    "enabled": true,
    "addr": "0.0.0.0:6060"
  },
  "node": {
    "chain": {
      "id": 49431,
      "info-file": "/config/l2_chain_info.json"
    }
  },
  "parent-chain": {
    "connection": {
      "url": "YOUR_SEPOLIA_RPC_URL"
    }
  },
  "validation": {
    "strategy": {
      "wait-for-confirmation": true,
      "disable-batch-posting": true
    },
    "mode": "staker",
    "staker": {
      "target-machines-count": 1
    }
  }
}
```

### 4.4 Create JWT Secret for Node Authentication

Create a JWT secret for secure communication between nodes:

```bash
openssl rand -hex 32 > ~/brewbridge/rollup/config/val_jwt.hex
```

## Step 5: Configure Espresso Caffeinated Node

### 5.1 Create the Caffeinated Node Configuration

Create a `caff_node.json` file in `~/brewbridge/rollup/caff-node/config`:

```json
{
  "parent-chain-node-url": "YOUR_SEPOLIA_WSS_URL",
  "chain": {
    "id": 49431,
    "info-file": "/config/l2_chain_info.json"
  },
  "data-dir": "/home/user/.arbitrum",
  "http": {
    "addr": "0.0.0.0:8550",
    "vhosts": "*",
    "corsdomain": "*",
    "api": [
      "eth",
      "net",
      "web3",
      "arb",
      "debug"
    ]
  },
  "log": {
    "context-indent": 0,
    "format": "text"
  },
  "namespace": 49431,
  "ws": {
    "addr": "0.0.0.0:8551",
    "api": [
      "net",
      "web3",
      "eth",
      "arb"
    ],
    "origins": [
      "*"
    ]
  },
  "hotshot-url": "https://query.decaf.testnet.espresso.network/v0",
  "next-hotshot-block": LATEST_HOTSHOT_BLOCK,
  "espresso-tee-verifier-addr": "0x8354db765810dF8F24f1477B06e91E5b17a408bF",
  "message-key-filepath": "",
  "batcher-check": false,
  "enable-l1-posting": false,
  "sequencer": true
}
```

Replace:
- `YOUR_SEPOLIA_WSS_URL` with a WebSocket Sepolia RPC URL
- `LATEST_HOTSHOT_BLOCK` with the latest block from Decaf testnet

### 5.2 Copy Chain Info to Caffeinated Node

Copy the L2 chain info to the caff-node configuration directory:

```bash
cp ~/brewbridge/rollup/config/l2_chain_info.json ~/brewbridge/rollup/caff-node/config/
```

## Step 6: Create Docker Compose Files

### 6.1 Create Nitro Node Docker Compose

Create a `docker-compose.yml` in `~/brewbridge/rollup`:

```yaml
version: '2.2'
services:
  nitro:
    image: ghcr.io/espressosystems/nitro-espresso-integration/nitro-node:integration
    container_name: nitro-node
    ports:
      - "8547:8547"
      - "8548:8548"
      - "8549:8549"
    command: --conf.file /config/full_node.json
    volumes:
      - ./config:/config
      - ./wasm:/home/user/wasm/
      - ./database:/home/user/.arbitrum
    depends_on:
      - validation_node
    logging:
      driver: "json-file"
      options:
        max-size: "100m"
        max-file: "10"

  validation_node:
    image: ghcr.io/espressosystems/nitro-espresso-integration/nitro-node:integration
    container_name: validation_node
    ports:
      - "8949:8549"
    volumes:
      - ./config:/config
    entrypoint: /usr/local/bin/nitro-val
    command: --conf.file /config/validation_node_config.json
    logging:
      driver: "json-file"
      options:
        max-size: "100m"
        max-file: "10"
```

### 6.2 Create Caffeinated Node Docker Compose

Create a `docker-compose.yml` in `~/brewbridge/rollup/caff-node`:

```yaml
version: '2.2'
services:
  caff_node:
    image: ghcr.io/espressosystems/nitro-espresso-integration/nitro-node:integration
    container_name: caff_node
    ports:
      - "8550:8550"
      - "8551:8551"
    command: --conf.file /config/caff_node.json
    volumes:
      - ./config:/config
      - ./database:/home/user/.arbitrum
    logging:
      driver: "json-file"
      options:
        max-size: "100m"
        max-file: "10"
```

## Step 7: Launch Nitro and Validation Nodes

### 7.1 Start the Nitro and Validation Nodes

Navigate to your rollup directory and start the nodes:

```bash
cd ~/brewbridge/rollup
sudo chown -R 1000:1000 database wasm
docker-compose up -d
```

### 7.2 Monitor Node Logs

Check the node logs to ensure they're running correctly:

```bash
docker-compose logs -f
```

Look for indications that the node is running and producing blocks.

### 7.3 Fund the Rollup with ETH

Before proceeding, you need to fund your rollup with ETH from Sepolia using Arbitrum's standard bridge:

1. Connect to Arbitrum Sepolia with MetaMask
2. Find the deposit functions in the bridge contract
3. Deposit a small amount of ETH to your rollup

## Step 8: Launch Caffeinated Node for Espresso Integration

### 8.1 Copy Database from Nitro to Caffeinated Node

Before starting the caffeinated node, copy the database from the Nitro node:

```bash
cd ~/brewbridge/rollup
cp -r database/* caff-node/database/
sudo chown -R 1000:1000 caff-node/database
```

### 8.2 Start the Caffeinated Node

Navigate to the caff-node directory and start the node:

```bash
cd ~/brewbridge/rollup/caff-node
docker-compose up -d
```

### 8.3 Monitor Caffeinated Node Logs

Check the caffeinated node logs to ensure it's connecting to Espresso:

```bash
docker-compose logs -f
```

Look for indications that the node is connecting to HotShot and receiving confirmations.

## Step 9: Verify Rollup Operation and Espresso Confirmations

### 9.1 Test Basic Connectivity

From your local machine, test connectivity to your rollup:

```bash
# Install cast if you don't have it
npm install -g cast

# Check chain ID
cast chain-id --rpc-url http://YOUR_EC2_IP:8547

# Check block number
cast block-number --rpc-url http://YOUR_EC2_IP:8547
```

### 9.2 Send Test Transactions

Send a test transaction to verify that the rollup is functioning:

1. Add your rollup as a custom network in MetaMask:
   - Network Name: BrewBridge
   - RPC URL: http://YOUR_EC2_IP:8547
   - Chain ID: 49431
   - Currency Symbol: ETH

2. Send a small amount of ETH from one account to another

### 9.3 Verify Espresso Confirmations

To verify that Espresso confirmations are working, you can use the hackathon example:

```bash
cd ~/brewbridge/hackathon-example
```

Edit `config/config.json`:

```json
{
  "caff_node_url": "http://localhost:8550",
  "from": "YOUR_TEST_WALLET_ADDRESS",
  "threshold": "0.1",
  "unit": "ETH"
}
```

Run the monitoring tool:

```bash
go run .
```

Send another test transaction and observe that the tool detects it with Espresso confirmations.

## Step 10: Set Up Monitoring Tools

### 10.1 Configure CloudWatch Logging (Optional)

For AWS CloudWatch logging:

1. Create an IAM role with CloudWatch permissions
2. Update your Docker Compose files to use the awslogs driver:

```yaml
logging:
  driver: "awslogs"
  options:
    awslogs-region: "YOUR_AWS_REGION"
    awslogs-group: "brewbridge-rollup-logs"
    awslogs-stream: "nitro-node"
```

### 10.2 Set Up Node Monitoring Tools

For basic monitoring, you can install Prometheus and Grafana:

```bash
# Create directories for Prometheus and Grafana
mkdir -p ~/brewbridge/monitoring/prometheus
mkdir -p ~/brewbridge/monitoring/grafana/data

# Create Prometheus config
cat > ~/brewbridge/monitoring/prometheus/prometheus.yml << 'EOF'
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'nitro'
    static_configs:
      - targets: ['nitro:6070']
  - job_name: 'validation'
    static_configs:
      - targets: ['validation_node:6060']
EOF

# Create Docker Compose for monitoring
cat > ~/brewbridge/monitoring/docker-compose.yml << 'EOF'
version: '3'

services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus:/etc/prometheus
    command: --config.file=/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    volumes:
      - ./grafana/data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
EOF

# Start monitoring
cd ~/brewbridge/monitoring
docker-compose up -d
```

## Step 11: Document RPC Endpoints and Configuration for BrewBridge Development

Create a document with all the important information for BrewBridge developers:

```bash
cat > ~/brewbridge/BREWBRIDGE_ENDPOINTS.md << 'EOF'
# BrewBridge Rollup Endpoints and Configuration

## Rollup Information
- Chain Name: BrewBridge
- Chain ID: 49431
- Deployment Date: $(date)

## RPC Endpoints
- HTTP RPC: http://YOUR_EC2_IP:8547
- WebSocket RPC: ws://YOUR_EC2_IP:8548
- Caffeinated Node: http://YOUR_EC2_IP:8550

## Contract Addresses
- Bridge: BRIDGE_ADDRESS
- Inbox: INBOX_ADDRESS
- Sequencer Inbox: SEQUENCER_INBOX_ADDRESS
- Rollup: ROLLUP_ADDRESS

## Espresso Integration
- HotShot URL: https://query.decaf.testnet.espresso.network/v0
- TEE Verifier Address: 0x8354db765810dF8F24f1477B06e91E5b17a408bF

## Monitoring
- Prometheus: http://YOUR_EC2_IP:9090
- Grafana: http://YOUR_EC2_IP:3000 (user: admin, password: admin)
EOF
```

## Conclusion

You have now successfully deployed an Arbitrum-Decaf Rollup for BrewBridge on AWS. This rollup provides:

- A dedicated Layer 2 blockchain for BrewBridge operations
- Fast transaction finality (2-3 seconds) with Espresso confirmations
- Strong security guarantees through the combination of Arbitrum and Espresso
- A foundation for building BrewBridge's cross-chain liquidity platform

The next steps would be to develop the BrewBridge application on top of this infrastructure, implementing the unified liquidity pool, AI routing optimizer, and user interface components.

## Maintenance and Operational Considerations

- **Regular Backups**: Set up regular backups of the rollup database
- **Monitoring and Alerts**: Configure alerts for node downtime or synchronization issues
- **Scale Resources**: Increase EC2 instance resources as the rollup grows in usage
- **Keep Software Updated**: Regularly update the Nitro and Espresso components as new versions are released
- **Security Audits**: Conduct regular security audits of the infrastructure and BrewBridge contracts
