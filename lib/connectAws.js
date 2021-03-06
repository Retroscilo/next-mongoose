/* eslint-disable curly */
/* eslint-disable no-alert */
/* eslint-disable prefer-arrow-callback */
import AWS from 'aws-sdk'
import nc from 'next-connect'

const Bucket = 'pixme'
const region = 'eu-west-3'
const IdentityPoolId = 'eu-west-3:4a23d360-fd09-4573-bf74-a451cd651088'

AWS.config.update({
  region,
  credentials: new AWS.CognitoIdentityCredentials({ IdentityPoolId }),
})

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: { Bucket },
})

export { s3 }

export async function uploadPhoto (albumName, filename, file) {
  if (!file) return console.log('Please choose a file to upload first.')
  const albumPhotoKey = encodeURIComponent(albumName) + '/'
  const photoKey = albumPhotoKey + filename

  const upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket,
      Key: photoKey,
      Body: file,
    },
  })
  const promise = upload.promise()
  try {
    await promise
    return s3.endpoint.href + Bucket + '/' + photoKey
  } catch (e) {
    console.log(e)
  }
}

export async function viewAlbum (albumName) {
  const albumKey = encodeURIComponent(albumName) + '/'
  s3.listObjects({ Prefix: albumKey }, function (err, data) {
    if(err) console.log('there was an error' + err.message)
    const href = this.request.httpRequest.endpoint.href
    const bucketUrl = href + Bucket + '/'

    const photos = data.Contents.map(function (photo) {
      const photoKey = photo.Key
      const photoUrl = bucketUrl + encodeURIComponent(photoKey)
      console.log(photoKey, photoUrl)
    })
  })
}

export function createAlbum (albumName) {
  albumName = albumName.trim()
  if (!albumName) {
    return alert('Album names must contain at least one non-space character.')
  }
  if (albumName.indexOf('/') !== -1) {
    return alert('Album names cannot contain slashes.')
  }
  const albumKey = encodeURIComponent(albumName)
  s3.headObject({ Key: albumKey }, function (err, data) {
    if (!err) {
      return alert('Album already exists.')
    }
    if (err.code !== 'NotFound') {
      console.log(err)
      console.log('There was an error creating your album in head: ' + err.message)
    }
    s3.putObject({ Key: albumKey }, function (err, data) {
      if (err) {
        return alert('There was an error creating your album in put: ' + err.message)
      }
      alert('Successfully created album.')
    })
  })
}
