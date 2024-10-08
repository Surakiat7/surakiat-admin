import React, { useState } from 'react';
import { Flex, Spin, Button } from 'antd';

interface ButtonSubmitProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  title: string;
  disabled: boolean;
}

const ButtonSubmit: React.FC<ButtonSubmitProps> = ({ handleSubmit, title, disabled }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await handleSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      aria-label="Submit button"
      id="submit-button"
      className={`flex justify-center items-center gap-2 overflow-hidden rounded-xl w-full py-6 font-semibold
         text-white bg-[#4EDFE7]`}
      onClick={handleClick}
      disabled={disabled || isLoading}
    >
      <span className="text-center">{title}</span>
      {isLoading && (
        <Flex align="center" gap="middle">
          <Spin />
        </Flex>
      )}
    </Button>
  );
};

export default ButtonSubmit;