import jsonfile from 'jsonfile'

export const save = (path, data) => {
  jsonfile.writeFile(path, data, (err) => {
    if (err) {
      console.error(err)
      throw err
    }
  })
}

export const load = (path) => {
  return new Promise((resolve, reject) => {
    jsonfile.readFile(path, (err, obj) => {
      if (err) {
        console.error(err)
        throw err
      } else {
        resolve(obj)
      }
    })
  })
}