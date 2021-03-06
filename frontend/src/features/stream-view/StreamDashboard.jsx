import React from 'react';
import classNames from 'classnames';

import {TokenImage, ArcProgressBar, Tooltip} from '../../components/kit';
import {streamViewData, StreamingSpeed, streamDirection} from '.';
import {
  StreamControls,
  StreamAutodepositControls,
  StreamDepositButtonOutlined,
} from '../stream-control';
import {StreamWithdrawButton} from '../stream-control/StreamWithdrawButton';
import {StreamProgressPercentage} from './StreamProgressPercentage';

export function StreamDashboard({stream, account}) {
  const {
    tf,
    progresses,
    percentages,
    isDead,
    progress: {full, withdrawn, streamed},
  } = streamViewData(stream);
  const direction = streamDirection({stream, account});

  return (
    <div
      className={classNames(
        'twind-flex',
        'twind-flex-col',
        'twind-items-center',
      )}
    >
      <div className="twind--mb-32">
        <Tooltip
          align={{offset: [0, -20]}}
          offset={{top: 20}}
          overlay={
            <div className="twind-text-left">
              <StreamProgressPercentage
                className="twind-whitespace-nowrap twind-mb-2"
                label="Withdrawn"
                colorClass="twind-bg-streams-withdrawn"
                formattedFloatValue={
                  tf.amount(withdrawn) + ' ' + stream.token_name
                }
                percentageValue={percentages.withdrawn}
              />
              <StreamProgressPercentage
                className="twind-whitespace-nowrap"
                label="Streamed"
                colorClass="twind-bg-streams-streamed"
                formattedFloatValue={
                  tf.amount(streamed) + ' ' + stream.token_name
                }
                percentageValue={percentages.streamed}
              />
            </div>
          }
        >
          <ArcProgressBar
            className="twind-w-96 twind-h-48"
            progresses={progresses}
          />
        </Tooltip>

        <div className="twind-flex twind-justify-between twind-pt-5 twind--mx-2 twind-text-gray">
          <div className="twind-w-10 twind-text-center"> 0%</div>
          <div className="twind-w-10 twind-text-center"> 100%</div>
        </div>
      </div>

      <TokenImage
        size={14}
        tokenName={stream.token_name}
        className="twind-mb-8"
      />
      <div className="twind-text-6xl twind-font-semibold">
        {tf.amount(streamed)}
      </div>
      <div className="twind-text-gray twind-font-semibold">
        of {tf.amount(full)} {stream.token_name}
      </div>
      <StreamingSpeed
        stream={stream}
        direction={direction}
        className="twind-mt-6 twind-mb-6"
      />
      {isDead ? (
        ''
      ) : (
        <>
          <div className="twind-flex twind-relative twind-z-10">
            <StreamControls stream={stream} className="twind-mr-2" />

            {/* render withdraw of add funds button */}
            {direction === 'out' ? (
              <StreamDepositButtonOutlined variant="outlined" stream={stream} />
            ) : direction === 'in' ? (
              <StreamWithdrawButton
                loadingText="Withdrawing..."
                variant="outlined"
                color="dark"
              >
                Withdraw from all streams
              </StreamWithdrawButton>
            ) : null}
          </div>
          {direction === 'out' ? (
            <StreamAutodepositControls
              stream={stream}
              enableMsg="Enable auto-deposit"
              disableMsg="Disable auto-deposit"
              className="twind-mt-4 twind-w-72"
            />
          ) : null}
        </>
      )}
    </div>
  );
}
