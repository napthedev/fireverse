import { FC } from "react";
import { Picker } from "emoji-mart";

interface EmojiPickerProps {
  onSelect: (emoji: any) => void;
}

const EmojiPicker: FC<EmojiPickerProps> = ({ onSelect }) => {
  return (
    <Picker
      set="facebook"
      enableFrequentEmojiSort
      onSelect={onSelect}
      theme="dark"
      showPreview={false}
      showSkinTones={false}
      emojiTooltip
      defaultSkin={1}
      color="#0F8FF3"
    />
  );
};

export default EmojiPicker;
