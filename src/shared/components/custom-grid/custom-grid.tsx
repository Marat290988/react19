import { CSSProperties } from 'react';
import styles from './custom-grid.module.scss';
import { Button } from '@mantine/core';
import { ButtonSure } from './sure-button/sure-button';
import { GridImage } from './grid-image/grid-image';

export interface IGrid {
  headersName: string[],
  columns: {
    name: string,
    isImage?: boolean,
    isAction?: boolean,
    styles?: CSSProperties,
    buttons?: {
      action?: Function | null,
      buttonColor?: 'indigo' | 'red' | 'gray',
      typeAction?: 'void' | 'item',
      buttonTitle: string,
      isSure?: boolean,
    }[]
  }[],
  gridSize: string,
  data: any[],
}

export const CustomGrid: React.FC<{ gridValue: IGrid, currentPage: number }> = ({ gridValue, currentPage }) => {

  return (
    <>
      <div className={styles['custom-grid']} style={{ gridTemplateColumns: gridValue.gridSize }}>
        <div className={styles['custom-grid__header']}>
          <div className={styles['custom-grid__cell']} style={{ justifyContent: 'center' }}>No.</div>
          {gridValue.headersName.map((headerItem, index) => (
            <div key={`header-${index}`} className={styles['custom-grid__cell']}>
              {headerItem}
            </div>
          ))}
        </div>
        {gridValue.data.map((dataItem, index) => (
          <div className={styles['custom-grid__row']} key={`row-${index}`}>
            <div className={styles['custom-grid__cell']} style={{ justifyContent: 'center' }}>{(currentPage * 10) + index + 1}</div>
            {gridValue.columns.map((column, columnIndex) => (
              <div key={`cell-${index}-${columnIndex}`} className={styles['custom-grid__cell']} style={column.styles}>
                {column.isImage ? (
                  <GridImage image={dataItem[column.name]} />
                  // <img className={styles['custom-grid__img']} src={dataItem[column.name]} />
                ) : column.isAction ? (
                  <div className={styles['custom-grid__buttons']}>
                    {column.buttons?.map((button, buttonIndex) => (
                      <div key={`button-${buttonIndex}`}>
                        {button.isSure ? <>
                          <ButtonSure 
                            key={`button-${buttonIndex}`}
                            onConfirm={() => button.typeAction === 'void' ? (button.action && button.action()) : (button.action && button.action(dataItem))}
                            btnConfig={button}
                            title={button.buttonTitle}
                          />
                        </> : <>
                          <Button
                            key={`button-${buttonIndex}`}
                            onClick={() => button.typeAction === 'void' ? (button.action && button.action()) : (button.action && button.action(dataItem))}
                            color={button.buttonColor ? button.buttonColor : ''}
                        >
                          {button.buttonTitle}
                        </Button>
                        </>}
                      </div>
                    ))}
                  </div>
                ) : (
                  dataItem[column.name]
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}