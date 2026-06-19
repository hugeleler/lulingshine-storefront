// 📁 路徑：src/sanity/schemaTypes/medusaStructure.ts
import React from 'react'

export const medusaStructure = (S: any) => 
  S.listItem()
    .title('8. 進入 Medusa 後台 ➔')
    .child(
      S.component()
        .id('medusa-redirect')
        .component(() => {
          // 🎯 點擊 8 號一級選單的瞬間，直接暗中執行彈出新分頁
          React.useEffect(() => {
            window.open('http://localhost:9000/app', '_blank', 'noopener,noreferrer')
          }, [])

          // 🚀 用純 JavaScript 建立畫面，絕不帶任何角括號，完美繞過 .ts 的限制！
          return React.createElement(
            'div',
            { style: { padding: '40px', fontFamily: 'sans-serif', color: '#333' } },
            React.createElement('h3', null, '🚀 正在為廬陵昱西打開 Medusa 後台...'),
            React.createElement(
              'p',
              { style: { color: '#666' } },
              '如果瀏覽器攔截了自動彈窗，請點擊此處：',
              React.createElement(
                'a',
                { 
                  href: 'http://localhost:9000/app', 
                  target: '_blank', 
                  rel: 'noreferrer',
                  style: { color: '#10b981', fontWeight: 'bold' } 
                },
                '手動直達'
              )
            )
          )
        })
    )