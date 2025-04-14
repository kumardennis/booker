import "./details-page-header.styles.scss";

type DetailsPageHeaderProps = {
  leftRow1Node: React.ReactNode;
  leftRow2Node: React.ReactNode;
  rightRow1Node: React.ReactNode;
  rightRow2Node: React.ReactNode;
  leadingIcon?: React.ReactNode;
};

export const DetailsPageHeader: React.FC<DetailsPageHeaderProps> = ({
  leftRow1Node,
  leftRow2Node,
  rightRow1Node,
  rightRow2Node,
  leadingIcon,
}) => {
  return (
    <div className="details-page__header">
      <div className="details-page__header__left">
        <div className="details-page__header__row1">{leftRow1Node}</div>
        <div className="details-page__header__row2">{leftRow2Node}</div>
      </div>
      <div className="details-page__header__right">
        <div className="details-page__header__row1">{rightRow1Node}</div>
        <div className="details-page__header__row2">{rightRow2Node}</div>
      </div>
    </div>
  );
};
