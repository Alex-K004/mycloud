const ShareLinkCopy = ({ shareLink }) => {
  const copy = () => {
    const url = `${process.env.REACT_APP_API_URL}/files/share/${shareLink}/`;
    navigator.clipboard.writeText(url);
    alert('Ссылка скопирована');
  };
  return <button onClick={copy}>Скопировать ссылку</button>;
};
export default ShareLinkCopy;