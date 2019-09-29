import React, { Fragment, useState, useRef } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { PDFDocument } from 'pdf-lib'

import {
  Upload,
  Button,
  Icon,
  Progress,
  Alert,
  Input } from 'antd'
import {
  Wrapper,
  DocumentView,
  Signature,
  DocumentSignedView,
  PersonInput } from './AppStyle'

function App() {
  const [ document, setDocument ] = useState()
  const [ documentSigned, setDocumentSigned ] = useState()
  const [ person, setPerson ] = useState('')
  const [ documentLoading, setDocumentLoading ] = useState(0)
  const [ error, setError ] = useState('')

  const signCanvas = useRef({})

  function onChange (info){
    setError('')

    if(info.file.type !== "application/pdf"){
      setError('Apenas documentos no formato PDF são permitidos!')
    }else{
      setDocumentLoading(Math.round(info.file.percent))

      const file = info.fileList[info.fileList.length - 1].originFileObj

      const reader = new FileReader()

      reader.readAsDataURL(file)

      reader.onload = () =>{
        setDocument(reader.result)
      }

      reader.onerror = () =>{
        setError('Houve um erro no carregamento do documento.')
      }

    }
  }

  async function generateSignature(){
    const signature = signCanvas.current.getTrimmedCanvas()
      .toDataURL('image/png')

    const documentToSign = await PDFDocument.load(document)

    const documentSignature  = await documentToSign.embedPng(signature)

    const pages = documentToSign.getPages()

    pages.map(page =>{
      page.drawImage(documentSignature,{
        y: 45,
        x: 60,
        height: documentSignature.scale(0.5).height,
        width: documentSignature.scale(0.5).width
      })

      page.drawText(person, {
        y: 20,
        x: (page.getWidth()/2) - (person.length * 7)/2,
        size: 14
      })

      page.drawRectangle({
        y: 40,
        x: 60,
        height: 1,
        width: page.getWidth() - 120
      })

      return null
    })

    const documentSigned = await documentToSign.saveAsBase64({dataUri: true})

    setDocumentSigned(documentSigned)
  }

  function eraseSignature(){
    signCanvas.current.clear()
  }


  return (
    <Wrapper>
      <DocumentView>
        <Upload
          name='document'
          action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
          accept='.pdf'
          showUploadList={false}
          onChange={info => onChange(info)}
        >
          <Button><Icon type="upload" /> Carregar documento</Button>
        </Upload>

        {
          documentLoading > 0
            && <Progress percent={documentLoading} />
        }

        {
          error.length > 0
            && <Alert
              message={error}
              type="error"
              closable
              showIcon
              style={{
                marginTop: '20px'
              }}
            />
        }

        {
          documentLoading >= 100
            && <Fragment>
                <object width="100%" height="800px" data={document} type="application/pdf">   </object>

                <PersonInput>
                  <label htmlFor="person">Digite o nome do assinante</label>
                  <Input
                    onChange={e => setPerson(e.target.value)}
                  />

                </PersonInput>
                <Signature>
                  <h2>Assine aqui seu documento</h2>

                  <h3>{person}</h3>
                  {
                    person.length > 0 && <hr/>
                  }

                  <SignatureCanvas
                    penColor='blue'
                    canvasProps={{width: 800, height: 200, className: 'sigCanvas'}}
                    ref={signCanvas}
                  />
                </Signature>

                <Fragment>
                  <Button
                    onClick={generateSignature}
                    style={{
                      marginRight: '10px'
                    }}
                  >
                    <Icon type="highlight" /> Gerar assinatura
                  </Button>

                  <Button
                    type="danger"
                    ghost
                    onClick={eraseSignature}
                  >
                    <Icon type="delete" /> Apagar assinatura
                  </Button>
                </Fragment>
              </Fragment>

        }


      </DocumentView>

      <DocumentSignedView>
        {
         documentSigned
            && <Fragment>
                 <Button
                   download
                   href={documentSigned}
                   style={{
                     marginBottom: '20px'
                   }}
                 >
                   <Icon type="download" /> Baixar documento assinado
                 </Button>

                 <object width="100%" height="800px" data={documentSigned} type="application/pdf">   </object>
              </Fragment>
        }

      </DocumentSignedView>
    </Wrapper>
  )
}

export default App
