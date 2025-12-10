import type { MediaModel } from "../Types";
interface MediaFileCardProp{
    media: MediaModel
}


export default function MediaFileCard({media}: MediaFileCardProp){

    return (
        
<div className="bg-gray-800 rounded-lg shadow-md p-4 text-gray-200 hover:shadow-lg transition overflow-auto">
      <p className="text-lg font-semibold text-blue-400 mb-2">{media.name}</p>
      <ul className="text-sm space-y-1">
        <li>
          <span className="font-medium text-gray-400">ID:</span> {media.id}
        </li>
        <li>
          <span className="font-medium text-gray-400">Type:</span> {media.mimetype}
        </li>
        <li>
          <span className="font-medium text-gray-400">Hash:</span> {media.hash}
        </li>
      </ul>
    </div>

    );
}