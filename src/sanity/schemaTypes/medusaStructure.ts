// 📁 路徑：src/sanity/schemaTypes/medusaStructure.ts
import React from 'react'

export const medusaStructure = (S: any) => 
  S.listItem()
    .title('8. 進入 Medusa 後台 ➔')
    .child(
      S.component()
        .id('medusa-redirect')
        .component(() => {
          React.useEffect(() => {
            window.open('http://localhost:9000/app', '_blank', 'noopener,noreferrer')
          }, [])

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