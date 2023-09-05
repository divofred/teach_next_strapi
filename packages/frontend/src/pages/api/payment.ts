import axios from 'axios'
import { getCookie } from 'cookies-next'
import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return reactToRequest(req, res)
  }
}

interface PaymentNotification {
  MERCHANT_ID: string
  AMOUNT: string
  intid: string
  MERCHANT_ORDER_ID: string
  P_EMAIL: string
  P_PHONE: string
  CUR_ID: string
  commission: string
  SIGN: string
}

// example {
//    MERCHANT_ID: '36370',
//    AMOUNT: '500',
//    intid: '0',
//    MERCHANT_ORDER_ID: 'Оплата услуги',
//    P_EMAIL: 'test@test.com',
//    P_PHONE: '',
//    CUR_ID: '4',
//    commission: '0',
//    SIGN: '4d60c0427b800afce407c26ac2086bc7'
//  }

async function reactToRequest(req: NextApiRequest, res: NextApiResponse) {
  const paymentToken =
    'bce20d31aec57ac70a33143c1c55a14d268f0e1655a6511a96db314717798ac81fafff48e29cd0f288b4fd8632e1bb41b78fa4ddd373aa62b23e4873734995d376a188f40390af931a9dfb26a27b76baf23f2df12795d746bf83e48920de22c442ca12a85896407d60589f4e49888c32e980dac26ea939dba5f1e6dbea4e20b6'
  const { P_EMAIL, AMOUNT }: PaymentNotification = req.body
  const data = await axios.get(`https://cms.skade.site/api/users?filters[email][$eq]=${P_EMAIL}`)
  const userId = data?.data?.[0]?.id

  if (AMOUNT === '500') {
    const data = axios.put(
      `https://cms.skade.site/api/users/${userId}`,
      { isPaidService: true },
      {
        headers: {
          Authorization: `Bearer ${paymentToken}`,
        },
      }
    )
  } else if (AMOUNT === '20000') {
    const data = axios.put(
      `https://cms.skade.site/api/users/${userId}`,
      { isPaidMan: true },
      {
        headers: {
          Authorization: `Bearer ${paymentToken}`,
        },
      }
    )
  }

  return res.send('YES')
}
