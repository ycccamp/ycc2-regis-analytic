import 'firebase/firestore'
import { firebase } from './firebase'

const tracks = ['developer', 'designer', 'creative']

export const getStat = async () => {
  const instance = firebase()

  const notLockedResultRef = await instance
    .firestore()
    .collection('registration')
    .where('isLocked', '==', false)

  const filter = await tracks.map(async track => {
    const snapshot = await notLockedResultRef.where('track', '==', track).get()

    const steps = [0, 1, 2, 3, 4, 5].map(async o => {
      const snapshotRef = notLockedResultRef
        .where('track', '==', track)
        .where('step', '==', o)

      const snapshot = await snapshotRef.get()

      const res = snapshot.docs.map(async doc => {
        const personalDoc = await instance
          .firestore()
          .collection('registration')
          .doc(doc.id)
          .collection('forms')
          .doc('personal')
          .get()

        const data = personalDoc.data()

        if (data === undefined) {
          return undefined
        } else {
          return {
            name: `${data.firstname} ${data.lastname} (${data.firstnameEn} ${data.lastnameEn})`,
            phone: `${data.phone}`,
          }
        }
      })

      return await Promise.all(res).then(res => [
        o,
        res.filter(o => o !== undefined),
      ])
    })

    return await Promise.all(steps).then(steps => ({
      track,
      amount: snapshot.size,
      steps: Object.assign(
        {},
        ...steps.map(([key, value]) => {
          return {
            [`${key}`]: value,
          }
        })
      ),
    }))
  })

  return Promise.all(filter).then(async res => {
    return {
      data: res,
    }
  })
}
