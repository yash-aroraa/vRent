Execution Instructions: 
1. Install Nodejs and npm 
2. Add Metamask Extension to the browser. Sign up for free and get free rinkeby testnet ethers from \"https://faucet.rinkeby.io\" 
3. Go to the project directory and run "npm init" 
4. Run "npm install" in the same directory. 
5. Go to the ethereum directory and run "node compile.js" 
6. Run "node deploy.js" in the same directory. 
7. Copy the address in the second line on the console "Factory Contract is deployed at address xxxx" 
8. Replace the address in line 7 of \ethereum\contracts\factory.js with the copied address. 
9. Go to the main project directory and run "npm run dev" 
10. Open browser and redirect to "http://localhost:3000"