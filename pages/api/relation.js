import RelationModel from "../../models/relation";

const queryRelation = async (req, res) => {
  const query = req.query;
  const relation = await RelationModel.findOne({ ids: query.id });
  return res.status(200).json({ relation });
};

export default async function handler(req, res) {
  const method = req.method;
  if (method === "GET") {
    return await queryRelation(req, res);
  }

  return res.status(200).json({ data: "" });
}
