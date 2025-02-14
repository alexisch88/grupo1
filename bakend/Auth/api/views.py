from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from Auth.api.serializers import UserSerializer


@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({
            "detail": "Password incorrect",
        }, status=status.HTTP_401_UNAUTHORIZED)
    # token, created = Token.objects.get_or_create(user=user)
    token = RefreshToken.for_user(user)
    Serializer = UserSerializer(instance=user)
    return Response({
        # "token": token.key,
        "refresh": str(token),
        "access": str(token.access_token),
        "user": Serializer.data
    })


@api_view(['POST'])
def signup(request):
    Serializer = UserSerializer(data=request.data)
    if Serializer.is_valid():
        Serializer.save()
        user = User.objects.get(username=request.data['username'])
        user.set_password(request.data['password'])
        user.save()
        # token, created = Token.objects.get_or_create(user=user)
        token = RefreshToken.for_user(user)
        return Response({
            # "token": token.key,
            "refresh": str(token),
            "access": str(token.access_token),
            "user": Serializer.data
        })
    return Response(Serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
# @authentication_classes([SessionAuthentication, TokenAuthentication])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def check_token(request):
    return Response("Valid for {}".format(request.user.email))

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)