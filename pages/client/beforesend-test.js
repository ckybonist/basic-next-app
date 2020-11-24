const Page = () => (
  <button
    type="button"
    onClick={() => {
      throw new Error('DROP_BY_BEFORESEND');
    }}
    style={{
      width: '50vw',
      height: '30vw',
      fontSize: '72px',
      color: 'red'
    }}
  >
    Clicke me to throw error
  </button>
);

export default Page;
