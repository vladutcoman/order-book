const OrderListHeaders = () => {
  return (
    <div className="grid px-4 grid-cols-3 gap-2 text-sm text-muted-foreground pb-1">
      <div className="text-left text-[12px] font-normal line-height-[18px]">
        Price (USDT)
      </div>
      <div className="text-right text-[12px] font-normal line-height-[18px]">
        Amount
      </div>
      <div className="text-right text-[12px] font-normal line-height-[18px]">
        Total
      </div>
    </div>
  );
};

export default OrderListHeaders;
