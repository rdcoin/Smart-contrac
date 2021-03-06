import React from 'react'
import { jsonApiOcrKeys, OcrKeyBundle } from 'factories/jsonApiOcrKeys'
import { jsonApiP2PKeys, P2PKeyBundle } from 'factories/jsonApiP2PKeys'

import { syncFetch } from 'test-helpers/syncFetch'
import globPath from 'test-helpers/globPath'
import { mountWithProviders } from 'test-helpers/mountWithTheme'
import { partialAsFull } from '@chainlink/ts-helpers'
import { INDEX_ENDPOINT as OCR_INDEX_ENDPOINT } from 'api/v2/ocrKeys'
import { INDEX_ENDPOINT as P2P_INDEX_ENDPOINT } from 'api/v2/p2pKeys'

import { KeysIndex } from 'pages/Keys/Index'

describe('pages/Keys/Index', () => {
  it('renders the OCR and P2P lists of keys', async () => {
    const [expectedOcr, expectedP2P] = [
      partialAsFull<OcrKeyBundle>({
        id: 'OcrKey',
      }),
      partialAsFull<P2PKeyBundle>({
        peerId: 'P2PId',
      }),
    ]

    global.fetch.getOnce(
      globPath(OCR_INDEX_ENDPOINT),
      jsonApiOcrKeys([expectedOcr]),
    )
    global.fetch.getOnce(
      globPath(P2P_INDEX_ENDPOINT),
      jsonApiP2PKeys([expectedP2P]),
    )

    const wrapper = mountWithProviders(<KeysIndex />)
    await syncFetch(wrapper)
    expect(wrapper.find('tbody').children().length).toEqual(2)

    expect(wrapper.text()).toContain(expectedOcr.id)
    expect(wrapper.text()).toContain(expectedP2P.peerId)
  })
})
