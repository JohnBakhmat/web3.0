require('@nomiclabs/hardhat-waffle')

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/EkwegWEhlIzDu_qZ4Te57vGJGFxM6HdY',
      accounts: [
        '7fc9d0142aec8e2f35a4f672fa104934d79dfbcaa0aa08a536f4c4ffd4f631ff',
      ],
    },
  },
}
