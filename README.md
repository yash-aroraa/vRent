Execution Instructions: 
1. Install Nodejs and npm 
2. Add Metamask Extension to the browser. Sign up for free and get free rinkeby testnet ethers from \"https://faucet.rinkeby.io\" 
3. Go to the project directory and run "npm init" 
4. Run "npm install" in the same directory. 
5. Go to the ethereum directory and run "node compile.js" 
6. Copy your account seed phrase from the metamask extension and replace the phrase in line 8 of \ethereum\deploy.js with it.
7. Run "node deploy.js" in the same directory. 
8. Copy the address in the second line on the console "Factory Contract is deployed at address xxxx" 
9. Replace the address in line 7 of \ethereum\contracts\factory.js with the copied address. 
10. Go to the main project directory and run "npm run dev" 
11. Open browser and redirect to "http://localhost:3000"
