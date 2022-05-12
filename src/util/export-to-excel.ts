import * as xlsx from 'xlsx'
export const jsonToExcel = (options:{
    data:any[],
    header?:Record<string, string>,
    fileName: string
}) => {
    let {header, data, fileName} = options
    const wb = xlsx.utils.book_new()
    if (header) {
       data = data.map((element:any) => {
            const obj:Record<string, any> = {}
            for (const key in element) {
              if (header && header[key]) {
                obj[header[key]] = element[key]
              } else {
                obj[key] = element[key]
              }
            }
            return obj
        });
    }

    const ws = xlsx.utils.json_to_sheet(data)
    xlsx.utils.book_append_sheet(wb, ws)
    xlsx.writeFile(wb, fileName, {
        bookType: 'xlsx'
    })
}
