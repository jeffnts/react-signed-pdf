import styled from 'styled-components'

import 'antd/dist/antd.min.css'

export const Wrapper = styled.div`
  display: grid;  
  
  @media(max-width: 799px){
    grid-template-rows: 1fr 1fr;
  }
  
  @media(min-width: 800px){
    grid-template-columns: 1fr 1fr;
  }
`

export const DocumentView = styled.div`
  padding: 40px;
`

export const DocumentSignedView = styled.div`
  padding: 40px;
`

export const PersonInput = styled.div`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  
  label{
    font-weight: bolder;
  }
`

export const Signature = styled.div`
  border: 1px solid black;
  position: relative;
  margin-bottom: 10px;
  
  h2{
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 14px;
    font-weight: bolder;
  }
  
   h3{
    position: relative;
    top: 120px;
    left: 10px;
    font-size: 16px;
    text-align: center;    
  }
  
  hr{
    position: absolute;
    top: 110px;
    left: 10px;
    width: calc(100% - 20px);
    text-align: center;
   
  }
`

