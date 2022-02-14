import axios from "axios";
import Link from "next/link";
import cn from "classnames";
import styles from "../../../../styles/userpostdetail.module.css";
import BackButton from "../../../../components/BackButton";
import ISODateFormatter from "../../../../components/ISODateFormatter";

function EventDetailUser({ code, eventDetail }) {
  const {
    title,
    context,
    created_at,
    updated_at,
    views,
    image,
    start_at,
    end_at,
    prev_id,
    prev_title,
    next_id,
    next_title,
  } = eventDetail;

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center pb-5">
      <header className="position-relative user-detail-header w-100 d-flex flex-column justify-content-center align-items-center fs-1">
        <BackButton url={`/user/${code}/event`} />
        <div>이벤트</div>
      </header>
      <div className="position-relative w-100 user-detail-title d-flex flex-column justify-content-center align-items-center">
        <div className="fs-1">{title}</div>
        <div className="position-absolute bottom-0 w-100 d-flex justify-content-end border-bottom text-secondary">
          {updated_at
            ? ISODateFormatter(updated_at)
            : ISODateFormatter(created_at)}{" "}
          | 조회수 {views}
        </div>
      </div>
      <div className="w-75 user-detail-section border-bottom d-flex flex-column justify-content-center align-items-center">
        <div>{context}</div>
      </div>
      <Link href={`/user/${code}/event`} passHref>
        <button
          type="button"
          className=" text-white btn user-detail-to-list-button m-3"
        >
          목록
        </button>
      </Link>
      {prev_id && (
        <Link href={`/user/${code}/event/${prev_id}`} passHref>
          <a
            className={cn(
              styles.prevnextButton,
              "p-1",
              "border-bottom",
              "border-top"
            )}
          >
            <div>이전글: {prev_title}</div>
          </a>
        </Link>
      )}
      {next_id && (
        <Link href={`/user/${code}/event/${next_id}`} passHref>
          <a className={cn(styles.prevnextButton, "p-1", "border-bottom")}>
            <div>다음글: {next_title}</div>
          </a>
        </Link>
      )}
    </div>
  );
}

export default EventDetailUser;

export async function getServerSideProps({ params }) {
  const code = params.code;
  const eId = params.id;

  const GET_HOSPITAL_ID_BY_CODE = `http://i6a205.p.ssafy.io:8000/api/code/${code}`;

  const { id } = await axios
    .post(GET_HOSPITAL_ID_BY_CODE)
    .then((res) => res.data)
    .catch((err) => console.log(err));
  // id 는 hospital_id
  if (!id) {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
    };
  }

  const EVENT_DETAIL_URL = `http://i6a205.p.ssafy.io:8000/api/event/${id}/${eId}`;
  const eventDetail = await axios
    .get(EVENT_DETAIL_URL)
    .then((res) => res.data)
    .catch((err) => console.log(err));

  if (Object.keys(eventDetail).length === 0) {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
    };
  }

  return {
    props: {
      code,
      eventDetail,
    },
  };
}
