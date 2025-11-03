// module.exports = {
//     apps: [
//         {
//             name: 'CV-QTLdb',
//             script: 'server/index.mjs',
//             env: {
//                 NODE_ENV: 'production',
//                 PORT: 8000,
//             },
//         },
//     ],
// };

module.exports = {
    apps: [
        {
            name: 'CV-QTLdb',
            script: 'server/index.mjs',
            env: {
                NODE_ENV: 'production',
                PORT: 8000,
                NUXT_APP_BASE_URL: '/CV-QTLdb/', 
            },
        },
    ],
};