export const testa = () => {
    console.log('intesta')
    return 'test'
}

export const getNum = async() => {
    console.log('ingetNum')
    let data
	await fetch('https://globalcaipiaokong.com/api/trial/draw-result?code=twklb&rows=1', {
		headers: {
			'content-type': 'application/json' // 這一欄一定要設定！
		},
		method: 'GET',
	})
	.then(response => {
        data = response.json()
    }) // 輸出成 json
	.catch((error) => {
		console.error("Error:", error)
	})

    return data
}