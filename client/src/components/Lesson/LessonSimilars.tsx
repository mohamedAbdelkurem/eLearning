//React
import { Link } from "react-router-dom";

//Dayjs

const SimilarLessons = ({ lessons, lessonSlug }) => {
  return (
    <div className="col-span-1 m-2 space-y-3 bg-white shadow-md">
      <div>
        <p className="mb-2 text-xl">Section lessons:</p>
      </div>
      <div className="space-y-3">
        {lessons.map(({ id, title, slug, identifier, subSlug }) => (
          <div className="mb-1" key={id} shadow-sm>
            <p className="text-base text-gray-800">
              {slug === lessonSlug ? (
                <p className="text-white bg-pacific-500">
                  <i className="m-2 text-xs text-white fas fa-play"></i> 
                  {title}
                </p>
              ) : (
                <Link to={`/p/${subSlug}/${identifier}/${slug}`}>{title}</Link>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarLessons;
