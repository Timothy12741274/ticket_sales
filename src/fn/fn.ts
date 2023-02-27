export const fn3 = (from:any, to:any, flights:Array<any>) => {
    let arr = flights.filter((f:any)=>f[0] === from)
    let fArr:Array<any> = arr

    const allComposedFlights = []
    for (let i = 2; i < 5; i++) {
        fArr = fn4(fArr, flights, i)
        allComposedFlights.push(...fArr)
    }
    //const finishArr = fn4(fArr, flights, 3)
    const suitableFlights = allComposedFlights.filter((cf)=>cf[cf.length-1] === to)
    return suitableFlights


}
const fn4:any = (fArr:Array<any>, flights: Array<any>, flightCount:number) => {
    for (let i = 0; i < flightCount-1; i++) {

        const newCf = fArr.map((cf: any) => {
            const Arr = flights.filter((f: any) => f[0] === cf[cf.length - 1])
            if (Arr.length === 0) return null
            const NewCfs = Arr.map((f: any) => cf + '-' + f)
            return NewCfs
        })

        fArr = []

        for (let i = 0; i < newCf.length; i++) {
            if (newCf[i]){
                // @ts-ignore
                fArr.push(...newCf[i])
            }
        }

        return fArr

    }
}